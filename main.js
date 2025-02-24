document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('modeSwitch');
    const modeLabel = document.getElementById('modeLabel');
    const inputContainer = document.getElementById('inputContainer');
    const resultContainer = document.getElementById('resultContainer');

    // Статические данные для тестирования
    const data = [
        { id: '1', name: 'Иван Иванов', date: '2023-10-01', site: 'example.com', telegram: '@ivan' },
        { id: '2', name: 'Петр Петров', date: '2023-10-02', site: 'example.org', telegram: '@petr' },
        { id: '3', name: 'Сергей Сергеев', date: '2023-10-03', site: 'example.net', telegram: '@sergey' },
        { id: '4', name: 'Алексей Алексеев', date: '2023-10-04', site: 'example.biz', telegram: '@alexey' },
        { id: '5', name: 'Мария Мариева', date: '2023-10-05', site: 'example.info', telegram: '@maria' },
        { id: '6', name: 'Анна Аннова', date: '2023-10-06', site: 'example.co', telegram: '@anna' },
        { id: '7', name: 'Дмитрий Дмитриев', date: '2023-10-07', site: 'example.io', telegram: '@dmitry' },
        { id: '8', name: 'Ольга Ольгова', date: '2023-10-08', site: 'example.ai', telegram: '@olga' },
        { id: '9', name: 'Николай Николаев', date: '2023-10-09', site: 'example.dev', telegram: '@nikolay' },
        { id: '10', name: 'Елена Еленова', date: '2023-10-10', site: 'example.tech', telegram: '@elena' },
        { id: '11', name: 'Виктор Викторов', date: '2023-10-11', site: 'example.xyz', telegram: '@viktor' },
        { id: '12', name: 'Татьяна Татьянова', date: '2023-10-12', site: 'example.site', telegram: '@tatyana' },
        { id: '13', name: 'Андрей Андреев', date: '2023-10-13', site: 'example.online', telegram: '@andrey' },
        { id: '14', name: 'Юлия Юлиева', date: '2023-10-14', site: 'example.store', telegram: '@yulia' },
        { id: '15', name: 'Максим Максимов', date: '2023-10-15', site: 'example.shop', telegram: '@maxim' }
    ];

    function createClientCard(client) {
        return `
            <div class="client-card" onclick="editClient('${client.id}')">
                <h3>${client.name}</h3>
                <p>${client.date}</p>
            </div>
        `;
    }

    function updateInputContainer() {
        if (toggleSwitch.checked) {
            modeLabel.textContent = 'Изменение';
            inputContainer.innerHTML = data.map(createClientCard).join('');
        } else {
            modeLabel.textContent = 'Поиск';
            inputContainer.innerHTML = `
                <input type="text" id="siteInput" placeholder="Сайт">
                <input type="text" id="telegramInput" placeholder="Телеграмм">
                <button id="searchButton">Поиск</button>
            `;
            document.getElementById('searchButton').addEventListener('click', searchClient);
        }
    }

    async function searchClient() {
        const siteInput = document.getElementById('siteInput').value;
        const telegramInput = document.getElementById('telegramInput').value;

        const response = await fetch('/search_client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ site_link: siteInput, contact_client: telegramInput })
        });

        const result = await response.json();

        if (response.ok) {
            resultContainer.innerHTML = `
                <div class="client-card">
                    <h3>${result.name_client}</h3>
                    <p>Сайт: ${result.site_link}</p>
                    <p>Телеграмм: ${result.contact_client}</p>
                    <p>Дата: ${result.date}</p>
                    <p>Сейл: ${result.name_sail}</p>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<p>Пользователь с такими данными (${siteInput}, ${telegramInput}) не найден.</p>`;
        }
    }

    window.editClient = function(clientId) {
        // Логика для редактирования клиента
        const client = data.find(client => client.id === clientId);
        inputContainer.innerHTML = `
            <div class="edit-container">
                <input type="text" value="${client.site}" placeholder="Сайт клиента">
                <input type="text" value="${client.date}" placeholder="Дата">
                <input type="text" value="${client.name}" placeholder="Имя клиента">
                <input type="text" value="${client.telegram}" placeholder="Телеграмм клиента">
                <button onclick="saveClient('${client.id}')">Изменить</button>
            </div>
        `;
    };

    window.saveClient = function(clientId) {
        // Логика для сохранения изменений клиента
        const client = data.find(client => client.id === clientId);
        client.site = document.querySelector('input[placeholder="Сайт клиента"]').value;
        client.date = document.querySelector('input[placeholder="Дата"]').value;
        client.name = document.querySelector('input[placeholder="Имя клиента"]').value;
        client.telegram = document.querySelector('input[placeholder="Телеграмм клиента"]').value;
        updateInputContainer();
    };

    toggleSwitch.addEventListener('change', updateInputContainer);

    // Инициализация начального состояния
    updateInputContainer();
});
