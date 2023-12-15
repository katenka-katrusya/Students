'use strict';

(() => {
  class Student {
    constructor(name, surname, patronymic, birthday, startDate, faculty) {
      this.name = name;
      this.surname = surname;
      this.patronymic = patronymic;
      this.birthday = birthday;
      this.startDate = startDate;
      this.faculty = faculty;
    }

    getFullName() {
      return `${this.surname} ${this.name} ${this.patronymic}`;
    }

    getAge() {
      return `${formatBirthday(this.birthday)} (${calculateAge(this.birthday)})`;
    }

    getYearsOfEducation() {
      return `${calculateEducationYears(this.startDate)}`;
    }
  }

  let studentsList = [
    new Student('Анна', 'Иванова', 'Сергеевна', '1998-04-10', '2023', 'Журналистики'),
    new Student('Евгений', 'Смирнов', 'Александрович', '2000-06-25', '2018', 'Экономики'),
    new Student('Мария', 'Кузнецова', 'Евгеньевна', '1990-03-05', '2020', 'Информационных технологий'),
    new Student('Екатерина', 'Соколова', 'Владимировна', '1993-12-30', '2022', 'Информационных технологий'),
    new Student('Дмитрий', 'Петров', 'Андреевич', '1993-10-17', '2021', 'Исторический'),
    new Student('Дмитрий', 'Носов', 'Андреевич', '1990-05-02', '2015', 'Исторический'),
    new Student('Александра', 'Крылова', 'Николаевна', '2001-05-02', '2023', 'Филологический'),
    new Student('Маргарита', 'Евтушенко', 'Олеговна', '1999-05-02', '2021', 'Физический'),
  ];

  // получаю текущую дату
  function getTodayDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return {day, month, year};
  }

  // форматирую дату рождения в "дд.мм.гггг"
  function formatBirthday(birthday) {
    return birthday.split('-').reverse().join('.');
  }

  // возраст сутдента
  function calculateAge(birthday) {
    let birthDate = new Date(birthday);
    let birthDateMonth = birthDate.getMonth() + 1;
    let todayDate = getTodayDate();
    let age = todayDate.year - birthDate.getFullYear();

    // если др ещё не было в этом году, то -1
    if (
      todayDate.month < birthDateMonth || (todayDate.month === birthDateMonth && todayDate.day < birthDate.getDate())
    ) {
      age--;
    }
    return formatAge(age);
  }

  function formatAge(age) {
    let ageString = age.toString();

    if (age < 20 && age > 10) {
      return `${age} лет`;
    } else {
      switch (ageString.at(-1)) {
        // использую return в самом switch, потому что если в конце написать return age, то возвращается undefined
        case '1':
          return `${age} год`;
        case '2':
        case '3':
        case '4':
          return `${age} года`;
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          return `${age} лет`;
      }
    }
  }

  function calculateEducationYears(startYear) {
    const numberStartYear = Number(startYear);
    const endDate = numberStartYear + 4;
    const todayDate = getTodayDate();
    const yearsDiff = todayDate.year - numberStartYear;

    // курс +1, если сентябрь наступил (учебный год с сентября)
    if (yearsDiff === 0 || yearsDiff > 0 && yearsDiff < 4 && todayDate.month >= 9) {
      return `${numberStartYear}-${endDate} (${yearsDiff + 1} курс)`;
    } else {
      return `${numberStartYear}-${endDate} (закончил)`;
    }
  }

  // добавляю атрибуты max для birthday и startDate
  function addMaxAttribute() {
    const birthdayInput = document.getElementById('birthday');
    const startDateInput = document.getElementById('startDate');
    // разбиваем по T и берем первый элемент, метод toISOString() возвращает строку формата YYYY-MM-DDTHH:mm:ss.sssZ
    birthdayInput.max = new Date().toISOString().split('T')[0];
    startDateInput.max = getTodayDate().year.toString();
    return {birthdayInput, startDateInput};
  }

  // Этап 3. Создайте функцию вывода одного студента в таблицу. У функции должен быть один аргумент - объект студента.

  function getStudentItem(studentObj) {
    const tr = document.createElement('tr');
    const tdFullName = document.createElement('td');
    const tdFaculty = document.createElement('td');
    const tdBirthday = document.createElement('td');
    const tdEducationYears = document.createElement('td');

    tdFullName.textContent = studentObj.getFullName();
    tdFaculty.textContent = studentObj.faculty;
    tdBirthday.textContent = studentObj.getAge();
    tdEducationYears.textContent = studentObj.getYearsOfEducation();

    tr.append(tdFullName, tdFaculty, tdBirthday, tdEducationYears);

    return tr;
  }

  // Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.
  // Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.

  function renderStudentsTable(studentsArray) {
    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';

    studentsArray.forEach((student) => {
      tbody.append(getStudentItem(student));
    });
    saveToLocalStorage(studentsArray);
  }

  // Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.
  function checkForm(form) {
    const birthdayInput = document.getElementById('birthday').value;
    const startDateInput = document.getElementById('startDate').value;

    const birthdayYear = new Date(birthdayInput).getFullYear();
    const startYear = startDateInput;
    const diffYears = startYear - birthdayYear;

    const allInputs = form.querySelectorAll('input');
    const pattern = /^[а-яА-ЯёЁa-zA-Z\- ]+$/;
    let isValidation = true;

    function createError(input, text) {
      const parentInput = input.parentNode;
      const divError = document.createElement('div');

      divError.textContent = text;

      parentInput.classList.add('error');
      divError.classList.add('error-div');

      parentInput.append(divError);
    }

    function removeError(input) {
      const parentInput = input.parentNode;

      if (parentInput.classList.contains('error')) {
        parentInput.classList.remove('error');
        parentInput.querySelector('.error-div').remove();
      }
    }

    allInputs.forEach(input => {
      removeError(input);

      if (input.dataset.required === 'true') {
        switch (true) {  // если хоть одно из условий истинно, то соответствующий блок кода внутри case выполнится
          case input.type === 'text' && !pattern.test(input.value):
            createError(input, 'Используйте буквы, дефис и пробел. Минимум 2 символа');
            isValidation = false;
            break;
          case input.value.trim() === '':
            choiceInput(input);
            isValidation = false;
            break;
          case input.type === 'date' && parseInt(calculateAge(input.value)) < 10:
            createError(input, 'Вы слишком молоды, чтобы здесь учиться');
            isValidation = false;
            break;
          case (input.type === 'date' || input.type === 'number') && birthdayYear > startYear:
            createError(input, 'Вы не можете начать учиться раньше года рождения');
            isValidation = false;
            break;
          case (input.type === 'date' || input.type === 'number') && diffYears < 10:
            createError(input, `Вы не можете начать учиться в возрасте ${diffYears} лет`);
            isValidation = false;
            break;
        }
      }
    });

    function choiceInput(input) {
      switch (input.id) {
        case 'name':
          createError(input, 'Введите имя');
          break;
        case 'surname':
          createError(input, 'Введите фамилию');
          break;
        case 'patronymic':
          createError(input, 'Введите отчество');
          break;
        case 'birthday':
          createError(input, 'Введите дату рождения');
          break;
        case 'startDate':
          createError(input, 'Введите год начала обучения');
          break;
        case 'faculty':
          createError(input, 'Введите факультет');
          break;
      }
    }

    return isValidation;
  }

  function submitOnForm() {
    const form = document.getElementById('studentForm');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('name').value;
      const surnameInput = document.getElementById('surname').value;
      const patronymicInput = document.getElementById('patronymic').value;
      const birthdayInput = document.getElementById('birthday').value;
      const startDateInput = document.getElementById('startDate').value;
      const facultyInput = document.getElementById('faculty').value;

      if (checkForm(form)) {    // добавляю новых студентов, если форма прошла валидацию

        const newStudent = new Student(
          nameInput, surnameInput, patronymicInput, birthdayInput, startDateInput, facultyInput
        );

        studentsList.push(newStudent);
        renderStudentsTable(studentsList);
        saveToLocalStorage(studentsList);
        form.reset();
      }
    });
  }

  // Этап 6. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
  function sortStudentsTable(array) {
    const table = document.querySelector('table');
    let direction = false;

    table.addEventListener('click', function ({target}) {
      if (target.tagName !== 'TH') return;

      const columnId = target.id;
      direction = !direction;

      sortTable(columnId, direction);
    });

    function sortTable(columnId, direction) {
      let copyArr;
      switch (columnId) {
        case 'fullNameStudent':
          copyArr = sortingOrder('surname', direction);
          break;
        case 'facultyStudent':
          copyArr = sortingOrder('faculty', direction);
          break;
        case 'birthdayStudent':
          copyArr = sortingOrder('birthday', direction);
          break;
        case 'yearsEducationStudent':
          copyArr = sortingOrder('startDate', direction);
          break;
        default:
          return;
      }
      renderStudentsTable(copyArr);
    }

    function sortingOrder(key, direction) {
      // key - название переменной (name, surname и т.д.)
      if (direction) {
        return array.slice().sort((a, b) => a[key].localeCompare(b[key]));
      } else {
        return array.slice().sort((a, b) => b[key].localeCompare(a[key]));
      }
    }
  }

  // Этап 7. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.
  function filterStudents() {
    const fullNameSearch = document.getElementById('fullNameSearch');
    const facultySearch = document.getElementById('facultySearch');
    const startDateSearch = document.getElementById('startDateSearch');
    const endDateSearch = document.getElementById('endDateSearch');

    fullNameSearch.addEventListener('input', filteredArrayStudents);
    facultySearch.addEventListener('input', filteredArrayStudents);
    startDateSearch.addEventListener('input', filteredArrayStudents);
    endDateSearch.addEventListener('input', filteredArrayStudents);

    function filteredArrayStudents() {
      const filterFullName = fullNameSearch.value.toLowerCase().trim();
      const filterFaculty = facultySearch.value.toLowerCase().trim();
      const filterStartDate = startDateSearch.value.toLowerCase().trim();
      const filterEndDate = endDateSearch.value.toLowerCase().trim();

      const filteredStudents = studentsList.filter((student) => {
        return (
          student.getFullName().toLowerCase().includes(filterFullName) &&
          student.faculty.toLowerCase().includes(filterFaculty) &&
          student.getYearsOfEducation().split('-')[0].includes(filterStartDate) &&
          student.getYearsOfEducation().split('-')[1].includes(filterEndDate)
        );
      });
      renderStudentsTable(filteredStudents);
      sortStudentsTable(filteredStudents);
    }
  }

  function saveToLocalStorage(array) {
    localStorage.setItem('studentsList', JSON.stringify(array));
  }

  function getFromLocalStorage(array) {
    if (localStorage.getItem('studentsList')) {
      const students = JSON.parse(localStorage.getItem('studentsList'));
      studentsList = students.map((student) => new Student(student.name, student.surname, student.patronymic, student.birthday, student.startDate, student.faculty));
    } else {
      studentsList = [];
    }
  }

  function mainFunction() {
    addMaxAttribute();
    submitOnForm();
    filterStudents();
    getFromLocalStorage(studentsList);
    sortStudentsTable(studentsList);
    renderStudentsTable(studentsList);
  }

  window.addEventListener('DOMContentLoaded', mainFunction);
})();

