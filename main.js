document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('modeSwitch');
    const modeLabel = document.getElementById('modeLabel');
    const inputContainer = document.getElementById('inputContainer');
    const resultContainer = document.getElementById('resultContainer');
    const dateContainer = document.getElementById('dateContainer');
    const dateInput = document.getElementById('dateInput');
    const prevDateButton = document.getElementById('prevDateButton');
    const nextDateButton = document.getElementById('nextDateButton');

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
            inputContainer.style.display = 'none';
            dateContainer.style.display = 'flex';
            loadClients();
        } else {
            modeLabel.textContent = 'Поиск';
            inputContainer.style.display = 'block';
            dateContainer.style.display = 'none';
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

    async function loadClients() {
        const date = dateInput.value;
        const response = await fetch(`/clients/${date}`);
        const clients = await response.json();

        if (response.ok) {
            resultContainer.innerHTML = clients.map(client => `
                <div class="client-card">
                    <h3>${client.name_client}</h3>
                    <p>Сайт: ${client.site_link}</p>
                    <p>Телеграмм: ${client.contact_client}</p>
                    <p>Дата: ${client.date}</p>
                    <p>Сейл: ${client.name_sail}</p>
                </div>
            `).join('');
        } else {
            resultContainer.innerHTML = `<p>Клиенты не найдены на дату ${date}.</p>`;
        }
    }

    function changeDate(days) {
        const date = new Date(dateInput.value);
        date.setDate(date.getDate() + days);
        dateInput.value = date.toISOString().split('T')[0];
        loadClients();
    }

    prevDateButton.addEventListener('click', () => changeDate(-1));
    nextDateButton.addEventListener('click', () => changeDate(1));

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
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    updateInputContainer();
});
