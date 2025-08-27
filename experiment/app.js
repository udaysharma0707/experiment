class LinkPageApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_a8EzRna8YeOCXyyPWyHkJzWDfLUf8Gu7Ly_uHlmjU7n0aMKIIauWUp0UFScIPFbl5_BqP96gi7Cu/pub?output=csv';
        this.cachedData = JSON.parse(localStorage.getItem('linkData')) || [];
        this.init();
    }

    init() {
        this.updateStatus();
        this.loadData();
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateStatus();
            this.loadData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus();
        });
    }

    updateStatus() {
        const statusElement = document.getElementById('status');
        if (this.isOnline) {
            statusElement.textContent = 'Online';
            statusElement.className = 'online-indicator';
        } else {
            statusElement.textContent = 'Offline';
            statusElement.className = 'offline-indicator';
        }
    }

    async loadData() {
        if (this.isOnline) {
            try {
                const response = await fetch(this.sheetUrl);
                const csvText = await response.text();
                const data = this.parseCSV(csvText);
                this.cachedData = data;
                localStorage.setItem('linkData', JSON.stringify(data));
                this.renderLinks(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                this.renderLinks(this.cachedData);
            }
        } else {
            this.renderLinks(this.cachedData);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length === headers.length) {
                const item = {};
                headers.forEach((header, index) => {
                    item[header.trim()] = row[index].trim();
                });
                data.push(item);
            }
        }
        return data;
    }

    renderLinks(data) {
        const content = document.getElementById('content');
        content.innerHTML = '';
        
        data.forEach(item => {
            const linkCard = document.createElement('div');
            linkCard.className = 'link-card';
            linkCard.innerHTML = `
                <h3>${item.title || 'Untitled'}</h3>
                <p>${item.description || ''}</p>
                <a href="${item.url || '#'}" target="_blank">Visit Link</a>
            `;
            content.appendChild(linkCard);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LinkPageApp();
});
