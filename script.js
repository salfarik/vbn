document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const mainMenu = document.getElementById('mainMenu');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const closeButtons = document.querySelectorAll('.close');
    const themeToggle = document.getElementById('themeToggle');
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToRegister = document.getElementById('switchToRegister');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const headerRight = document.querySelector('.header-right');
    
    // Проверяем сохранённую тему и авторизацию
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUsername = localStorage.getItem('username') || 'Пользователь';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (isLoggedIn) {
        showProfileButton(savedUsername);
    }
    
    // Тематические страницы
    const topics = {
        web: {
            title: 'Веб-разработка',
            content: 'Изучи HTML, CSS и JavaScript для создания современных веб-сайтов и приложений. Начни с основ и перейди к продвинутым фреймворкам!',
            icon: '🌐',
            lessons: [
                { title: 'Введение в HTML', description: 'Основы создания структуры веб-страниц' },
                { title: 'Стилизация с CSS', description: 'Изучите каскадные таблицы стилей' },
                { title: 'JavaScript для начинающих', description: 'Основы программирования на JavaScript' }
            ]
        },
        python: {
            title: 'Python',
            content: 'Python - мощный и простой в изучении язык. Идеален для начинающих! Используется в вебе, науке, анализе данных и автоматизации.',
            icon: '🐍',
            lessons: [
                { title: 'Синтаксис Python', description: 'Основные конструкции языка' },
                { title: 'Функции и модули', description: 'Как организовывать код в Python' },
                { title: 'Работа с данными', description: 'Обработка и анализ информации' }
            ]
        },
        games: {
            title: 'Разработка игр',
            content: 'Создавай свои игры с Unity, Godot или другими движками. Узнай о геймдизайне, физике и игровой логике.',
            icon: '🎮',
            lessons: [
                { title: 'Введение в геймдизайн', description: 'Основные принципы создания игр' },
                { title: 'Unity для начинающих', description: 'Первые шаги в популярном движке' },
                { title: 'Игровая физика', description: 'Реализация физики в играх' }
            ]
        },
        mobile: {
            title: 'Мобильные приложения',
            content: 'Разрабатывай приложения для Android и iOS с помощью Flutter или React Native. Публикуй свои приложения в магазинах!',
            icon: '📱',
            lessons: [
                { title: 'Введение в мобильную разработку', description: 'Обзор платформ и технологий' },
                { title: 'Flutter основы', description: 'Кроссплатформенная разработка' },
                { title: 'UI/UX для мобильных', description: 'Дизайн интерфейсов' }
            ]
        }
    };
    
    // Показать кнопку профиля (выпадающее меню)
    function showProfileButton(username) {
        headerRight.innerHTML = '';
        
        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-container';
        profileContainer.style.position = 'relative';
        
        const profileBtn = document.createElement('button');
        profileBtn.className = 'profile-btn';
        profileBtn.innerHTML = `
            <span class="user-icon">👤</span> 
            ${username}
            <span class="dropdown-arrow">▼</span>
        `;
        
        const profileDropdown = document.createElement('div');
        profileDropdown.className = 'profile-dropdown';
        profileDropdown.innerHTML = `
            <div class="profile-info">
                <div class="profile-avatar">${username.charAt(0).toUpperCase()}</div>
                <h3>${username}</h3>
                <p>Уровень: <span class="user-level">Новичок</span></p>
                <p>Прогресс: <progress value="25" max="100"></progress> 25%</p>
                <button class="logout-btn">Выйти</button>
            </div>
        `;
        
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        profileDropdown.querySelector('.logout-btn').addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            
            // Обновляем интерфейс
            headerRight.innerHTML = `
                <button id="loginBtn" class="auth-btn">Вход</button>
                <button id="registerBtn" class="auth-btn register-btn">Регистрация</button>
            `;
            
            // Перепривязываем обработчики
            document.getElementById('loginBtn').addEventListener('click', () => {
                showModal(loginModal);
                loginModal.querySelector('.modal-content').classList.add('animate__fadeInDown');
            });
            
            document.getElementById('registerBtn').addEventListener('click', () => {
                showModal(registerModal);
                registerModal.querySelector('.modal-content').classList.add('animate__fadeInDown');
            });
        });
        
        profileContainer.appendChild(profileBtn);
        profileContainer.appendChild(profileDropdown);
        headerRight.appendChild(profileContainer);
        
        // Закрытие dropdown при клике вне его
        document.addEventListener('click', function(e) {
            if (!profileContainer.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    // Обработчики кнопок тем
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            showTopicPage(topic);
            
            // Анимация нажатия кнопки
            this.classList.add('animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__pulse');
            }, 500);
        });
    });
    
    // Показать страницу темы с анимацией
	function showTopicPage(topic) {
		mainMenu.classList.add('animate__fadeOut');
		
		setTimeout(() => {
			mainMenu.style.display = 'none';
			mainMenu.classList.remove('animate__fadeOut');
			
			const topicPage = document.createElement('section');
			topicPage.className = 'topic-page animate__animated animate__fadeIn';
			topicPage.id = `${topic}-page`;
			topicPage.style.display = 'block'; // Добавляем отображение
			
			// Генерация карточек уроков
			const lessonsHTML = topics[topic].lessons.map((lesson, index) => `
				<div class="lesson-card animate__animated animate__zoomIn animate__delay-${index + 1}s">
					<h3>${lesson.title}</h3>
					<p>${lesson.description}</p>
					<button class="start-lesson-btn">Начать урок</button>
				</div>
			`).join('');
			
			topicPage.innerHTML = `
				<div class="topic-header">
					<button class="back-btn-topic animate__animated animate__fadeInLeft">← Назад к темам</button>
					<h2 class="animate__animated animate__fadeIn">${topics[topic].icon} ${topics[topic].title}</h2>
				</div>
				<div class="topic-description animate__animated animate__fadeIn animate__delay-1s">
					<p>${topics[topic].content}</p>
				</div>
				<div class="lessons-container animate__animated animate__fadeIn animate__delay-2s">
					<h3>Доступные уроки:</h3>
					${lessonsHTML}
				</div>
			`;
			
			document.querySelector('main').appendChild(topicPage);
			
			// Обработчик кнопки "Назад"
			topicPage.querySelector('.back-btn-topic').addEventListener('click', function() {
				topicPage.classList.add('animate__fadeOut');
				
				setTimeout(() => {
					topicPage.remove();
					mainMenu.style.display = 'block';
					mainMenu.classList.add('animate__fadeIn');
					
					setTimeout(() => {
						mainMenu.classList.remove('animate__fadeIn');
					}, 500);
				}, 500);
			});
			
			// Обработчики кнопок уроков
			topicPage.querySelectorAll('.start-lesson-btn').forEach(btn => {
				btn.addEventListener('click', function() {
					if (localStorage.getItem('isLoggedIn') === 'true') {
						this.textContent = 'Урок начат!';
						this.classList.add('animate__heartBeat');
						
						setTimeout(() => {
							this.classList.remove('animate__heartBeat');
						}, 1500);
					} else {
						this.textContent = 'Требуется вход!';
						this.classList.add('error');
						
						setTimeout(() => {
							this.textContent = 'Начать урок';
							this.classList.remove('error');
						}, 1500);
					}
				});
			});
		}, 500);
	}
    
    // Переключение темы
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Анимация переключения
        this.classList.add('animate__pulse');
        setTimeout(() => {
            this.classList.remove('animate__pulse');
        }, 500);
    });
    
    // Обновление иконки темы
    function updateThemeIcon(theme) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    // Модальные окна
    function showModal(modal) {
        document.body.style.overflow = 'hidden';
        modal.style.display = 'block';
    }
    
    function hideModal(modal) {
        document.body.style.overflow = 'auto';
        modal.style.display = 'none';
    }
    
    // Обработчики открытия модальных окон
    registerBtn?.addEventListener('click', () => {
        showModal(registerModal);
        registerModal.querySelector('.modal-content').classList.add('animate__fadeInDown');
    });
    
    loginBtn?.addEventListener('click', () => {
        showModal(loginModal);
        loginModal.querySelector('.modal-content').classList.add('animate__fadeInDown');
    });
    
    // Обработчики закрытия модальных окон
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.querySelector('.modal-content').classList.remove('animate__fadeInDown');
            modal.querySelector('.modal-content').classList.add('animate__fadeOutUp');
            
            setTimeout(() => {
                hideModal(modal);
                modal.querySelector('.modal-content').classList.remove('animate__fadeOutUp');
            }, 500);
        });
    });
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.querySelector('.modal-content').classList.remove('animate__fadeInDown');
            registerModal.querySelector('.modal-content').classList.add('animate__fadeOutUp');
            
            setTimeout(() => {
                hideModal(registerModal);
                registerModal.querySelector('.modal-content').classList.remove('animate__fadeOutUp');
            }, 500);
        }
        
        if (e.target === loginModal) {
            loginModal.querySelector('.modal-content').classList.remove('animate__fadeInDown');
            loginModal.querySelector('.modal-content').classList.add('animate__fadeOutUp');
            
            setTimeout(() => {
                hideModal(loginModal);
                loginModal.querySelector('.modal-content').classList.remove('animate__fadeOutUp');
            }, 500);
        }
    });
    
    // Переключение между модальными окнами входа и регистрации
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.querySelector('.modal-content').classList.remove('animate__fadeInDown');
        registerModal.querySelector('.modal-content').classList.add('animate__fadeOutLeft');
        
        setTimeout(() => {
            hideModal(registerModal);
            registerModal.querySelector('.modal-content').classList.remove('animate__fadeOutLeft');
            showModal(loginModal);
            loginModal.querySelector('.modal-content').classList.add('animate__fadeInRight');
        }, 500);
    });
    
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.querySelector('.modal-content').classList.remove('animate__fadeInDown');
        loginModal.querySelector('.modal-content').classList.add('animate__fadeOutRight');
        
        setTimeout(() => {
            hideModal(loginModal);
            loginModal.querySelector('.modal-content').classList.remove('animate__fadeOutRight');
            showModal(registerModal);
            registerModal.querySelector('.modal-content').classList.add('animate__fadeInLeft');
        }, 500);
    });
    
    // Валидация формы регистрации
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');
        let isValid = true;
        
        // Валидация имени пользователя
        if (username.value.length < 3) {
            document.getElementById('regUsernameError').textContent = 'Имя должно быть не менее 3 символов';
            username.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('regUsernameError').textContent = '';
            username.classList.remove('error');
        }
        
        // Валидация email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            document.getElementById('regEmailError').textContent = 'Введите корректный email';
            email.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('regEmailError').textContent = '';
            email.classList.remove('error');
        }
        
        // Валидация пароля
        if (password.value.length < 6) {
            document.getElementById('regPasswordError').textContent = 'Пароль должен быть не менее 6 символов';
            password.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('regPasswordError').textContent = '';
            password.classList.remove('error');
        }
        
        if (isValid) {
            // Сохраняем данные пользователя
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username.value);
            
            // Анимация успешной регистрации
            registerForm.classList.add('animate__zoomOut');
            
            setTimeout(() => {
                registerForm.style.display = 'none';
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message animate__animated animate__zoomIn';
                successMessage.innerHTML = `
                    <h3>Регистрация успешна!</h3>
                    <p>Добро пожаловать, ${username.value}!</p>
                    <button id="continueBtn" class="submit-btn">Продолжить</button>
                `;
                
                registerModal.querySelector('.modal-content').appendChild(successMessage);
                
                document.getElementById('continueBtn').addEventListener('click', () => {
                    successMessage.classList.add('animate__zoomOut');
                    
                    setTimeout(() => {
                        hideModal(registerModal);
                        registerForm.style.display = 'block';
                        registerForm.classList.remove('animate__zoomOut');
                        registerForm.reset();
                        successMessage.remove();
                        
                        // Показываем кнопку профиля
                        showProfileButton(username.value);
                    }, 500);
                });
            }, 500);
        }
    });
    
    // Валидация формы входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername');
        const password = document.getElementById('loginPassword');
        let isValid = true;
        
        // Валидация имени пользователя/email
        if (username.value.trim() === '') {
            document.getElementById('loginUsernameError').textContent = 'Введите имя пользователя или email';
            username.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('loginUsernameError').textContent = '';
            username.classList.remove('error');
        }
        
        // Валидация пароля
        if (password.value.trim() === '') {
            document.getElementById('loginPasswordError').textContent = 'Введите пароль';
            password.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('loginPasswordError').textContent = '';
            password.classList.remove('error');
        }
        
        if (isValid) {
            // Сохраняем данные пользователя
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username.value);
            
            // Анимация успешного входа
            loginForm.classList.add('animate__zoomOut');
            
            setTimeout(() => {
                loginForm.style.display = 'none';
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message animate__animated animate__zoomIn';
                successMessage.innerHTML = `
                    <h3>Вход выполнен!</h3>
                    <p>Добро пожаловать, ${username.value}!</p>
                    <button id="continueLogin" class="submit-btn">Продолжить</button>
                `;
                
                loginModal.querySelector('.modal-content').appendChild(successMessage);
                
                document.getElementById('continueLogin').addEventListener('click', () => {
                    successMessage.classList.add('animate__zoomOut');
                    
                    setTimeout(() => {
                        hideModal(loginModal);
                        loginForm.style.display = 'block';
                        loginForm.classList.remove('animate__zoomOut');
                        loginForm.reset();
                        successMessage.remove();
                        
                        // Показываем кнопку профиля
                        showProfileButton(username.value);
                    }, 500);
                });
            }, 500);
        }
    });
    
    // Анимация при загрузке страницы
    setTimeout(() => {
        document.querySelectorAll('.topic-btn').forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.classList.add('animate__fadeInUp');
        });
    }, 300);
});



