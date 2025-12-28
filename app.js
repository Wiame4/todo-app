// Classe Task pour représenter une tâche
class Task {
    constructor(id, text, completed = false, createdAt = new Date()) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
        this.updatedAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
        this.updatedAt = new Date();
    }

    updateText(newText) {
        this.text = newText;
        this.updatedAt = new Date();
    }
}

// Classe TodoApp - application principale
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.editingTaskId = null;
        this.pendingAction = null;
        
        this.loadTasks();
        this.initElements();
        this.initEventListeners();
        this.initTheme();
        this.render();
    }

    // Initialiser les références aux éléments DOM
    initElements() {
        this.elements = {
            taskInput: document.getElementById('taskInput'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            tasksContainer: document.getElementById('tasksContainer'),
            totalTasks: document.getElementById('totalTasks'),
            completedTasks: document.getElementById('completedTasks'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            sortSelect: document.getElementById('sortSelect'),
            clearCompletedBtn: document.getElementById('clearCompletedBtn'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            editModal: document.getElementById('editModal'),
            editTaskInput: document.getElementById('editTaskInput'),
            saveEditBtn: document.getElementById('saveEditBtn'),
            cancelEditBtn: document.getElementById('cancelEditBtn'),
            closeModalBtns: document.querySelectorAll('.close-modal'),
            confirmModal: document.getElementById('confirmModal'),
            confirmMessage: document.getElementById('confirmMessage'),
            confirmActionBtn: document.getElementById('confirmActionBtn'),
            cancelActionBtn: document.getElementById('cancelActionBtn'),
            themeToggle: document.getElementById('themeToggle')
        };
    }

    // Initialiser les écouteurs d'événements
    initEventListeners() {
        // Ajouter une tâche
        this.elements.addTaskBtn.addEventListener('click', () => this.addTask());
        this.elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filtres
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Tri
        this.elements.sortSelect.addEventListener('change', (e) => {
            this.setSort(e.target.value);
        });

        // Actions globales
        this.elements.clearCompletedBtn.addEventListener('click', () => this.confirmClearCompleted());
        this.elements.clearAllBtn.addEventListener('click', () => this.confirmClearAll());

        // Modale d'édition
        this.elements.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.elements.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Modale de confirmation
        this.elements.confirmActionBtn.addEventListener('click', () => this.executePendingAction());
        this.elements.cancelActionBtn.addEventListener('click', () => this.closeConfirmModal());

        // Fermer les modales en cliquant à l'extérieur
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.editModal) this.closeEditModal();
            if (e.target === this.elements.confirmModal) this.closeConfirmModal();
        });

        // Thème
        this.elements.themeToggle.addEventListener('change', () => this.toggleTheme());
    }

    // Initialiser le thème
    initTheme() {
        const savedTheme = localStorage.getItem('todo-app-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeToggle.checked = savedTheme === 'dark';
    }

    // Basculer le thème
    toggleTheme() {
        const newTheme = this.elements.themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('todo-app-theme', newTheme);
    }

    // Charger les tâches depuis le localStorage
    loadTasks() {
        const savedTasks = localStorage.getItem('todo-app-tasks');
        if (savedTasks) {
            const tasksData = JSON.parse(savedTasks);
            this.tasks = tasksData.map(taskData => {
                const task = new Task(
                    taskData.id,
                    taskData.text,
                    taskData.completed,
                    new Date(taskData.createdAt)
                );
                task.updatedAt = new Date(taskData.updatedAt);
                return task;
            });
        }
    }

    // Sauvegarder les tâches dans le localStorage
    saveTasks() {
        localStorage.setItem('todo-app-tasks', JSON.stringify(this.tasks));
    }

    // Ajouter une nouvelle tâche
    addTask() {
        const text = this.elements.taskInput.value.trim();
        
        if (!text) {
            this.showNotification('Veuillez entrer une tâche', 'warning');
            return;
        }

        if (text.length > 100) {
            this.showNotification('La tâche ne doit pas dépasser 100 caractères', 'warning');
            return;
        }

        const id = Date.now().toString();
        const newTask = new Task(id, text);
        this.tasks.unshift(newTask);
        
        this.saveTasks();
        this.render();
        
        this.elements.taskInput.value = '';
        this.elements.taskInput.focus();
        
        this.showNotification('Tâche ajoutée avec succès', 'success');
    }

    // Supprimer une tâche
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
        this.showNotification('Tâche supprimée', 'info');
    }

    // Basculer l'état d'une tâche
    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleComplete();
            this.saveTasks();
            this.render();
            
            const status = task.completed ? 'terminée' : 'marquée comme en cours';
            this.showNotification(`Tâche ${status}`, 'success');
        }
    }

    // Ouvrir la modale d'édition
    openEditModal(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.elements.editTaskInput.value = task.text;
            this.elements.editModal.style.display = 'flex';
            this.elements.editTaskInput.focus();
            this.elements.editTaskInput.select();
        }
    }

    // Fermer la modale d'édition
    closeEditModal() {
        this.editingTaskId = null;
        this.elements.editModal.style.display = 'none';
        this.elements.editTaskInput.value = '';
    }

    // Fermer toutes les modales
    closeAllModals() {
        this.closeEditModal();
        this.closeConfirmModal();
    }

    // Sauvegarder l'édition
    saveEdit() {
        const newText = this.elements.editTaskInput.value.trim();
        
        if (!newText) {
            this.showNotification('La tâche ne peut pas être vide', 'warning');
            return;
        }

        if (newText.length > 100) {
            this.showNotification('La tâche ne doit pas dépasser 100 caractères', 'warning');
            return;
        }

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.updateText(newText);
            this.saveTasks();
            this.render();
            this.closeEditModal();
            this.showNotification('Tâche modifiée avec succès', 'success');
        }
    }

    // Définir le filtre actuel
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Mettre à jour les boutons de filtre
        this.elements.filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        this.render();
    }

    // Définir le tri actuel
    setSort(sort) {
        this.currentSort = sort;
        this.render();
    }

    // Obtenir les tâches filtrées
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];
        
        // Appliquer le filtre
        switch (this.currentFilter) {
            case 'active':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            // 'all' ne filtre pas
        }
        
        // Appliquer le tri
        switch (this.currentSort) {
            case 'date-desc':
                filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'date-asc':
                filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
                break;
            case 'name-asc':
                filteredTasks.sort((a, b) => a.text.localeCompare(b.text, 'fr'));
                break;
            case 'name-desc':
                filteredTasks.sort((a, b) => b.text.localeCompare(a.text, 'fr'));
                break;
        }
        
        return filteredTasks;
    }

    // Confirmer la suppression des tâches terminées
    confirmClearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            this.showNotification('Aucune tâche terminée à supprimer', 'info');
            return;
        }
        
        this.pendingAction = () => this.clearCompletedTasks();
        this.elements.confirmMessage.textContent = 
            `Êtes-vous sûr de vouloir supprimer les ${completedCount} tâche(s) terminée(s) ?`;
        this.elements.confirmModal.style.display = 'flex';
    }

    // Confirmer la suppression de toutes les tâches
    confirmClearAll() {
        if (this.tasks.length === 0) {
            this.showNotification('Aucune tâche à supprimer', 'info');
            return;
        }
        
        this.pendingAction = () => this.clearAllTasks();
        this.elements.confirmMessage.textContent = 
            `Êtes-vous sûr de vouloir supprimer toutes les ${this.tasks.length} tâches ? Cette action est irréversible.`;
        this.elements.confirmModal.style.display = 'flex';
    }

    // Exécuter l'action en attente
    executePendingAction() {
        if (this.pendingAction) {
            this.pendingAction();
            this.pendingAction = null;
        }
        this.closeConfirmModal();
    }

    // Fermer la modale de confirmation
    closeConfirmModal() {
        this.elements.confirmModal.style.display = 'none';
        this.pendingAction = null;
    }

    // Supprimer les tâches terminées
    clearCompletedTasks() {
        const initialCount = this.tasks.length;
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
        
        const deletedCount = initialCount - this.tasks.length;
        this.showNotification(`${deletedCount} tâche(s) terminée(s) supprimée(s)`, 'success');
    }

    // Supprimer toutes les tâches
    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.render();
        this.showNotification('Toutes les tâches ont été supprimées', 'success');
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Ajouter les styles pour la notification
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    border-radius: var(--border-radius-sm);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    z-index: 2000;
                    box-shadow: var(--shadow-hover);
                    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                    max-width: 400px;
                }
                .notification-success {
                    background-color: #d4edda;
                    color: #155724;
                    border-left: 5px solid #28a745;
                }
                .notification-warning {
                    background-color: #fff3cd;
                    color: #856404;
                    border-left: 5px solid #ffc107;
                }
                .notification-info {
                    background-color: #d1ecf1;
                    color: #0c5460;
                    border-left: 5px solid #17a2b8;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Ajouter la notification au DOM
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Formater une date
    formatDate(date) {
        const now = new Date();
        const taskDate = new Date(date);
        const diffMs = now - taskDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) {
            return 'À l\'instant';
        } else if (diffMins < 60) {
            return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else {
            return taskDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    }

    // Rendu de l'application
    render() {
        const filteredTasks = this.getFilteredTasks();
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        // Mettre à jour les compteurs
        this.elements.totalTasks.textContent = `${totalTasks} tâche${totalTasks > 1 ? 's' : ''}`;
        this.elements.completedTasks.textContent = `${completedTasks} terminée${completedTasks > 1 ? 's' : ''}`;
        
        // Rendre les tâches
        if (filteredTasks.length === 0) {
            let message = '';
            switch (this.currentFilter) {
                case 'active':
                    message = 'Aucune tâche en cours';
                    break;
                case 'completed':
                    message = 'Aucune tâche terminée';
                    break;
                default:
                    message = 'Vous n\'avez aucune tâche pour le moment';
            }
            
            this.elements.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-check"></i>
                    <p>${message}</p>
                    <p class="empty-state-sub">${this.currentFilter === 'all' ? 'Commencez par ajouter une tâche ci-dessus' : 'Changez de filtre pour voir d\'autres tâches'}</p>
                </div>
            `;
        } else {
            this.elements.tasksContainer.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-content">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <div>
                            <div class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</div>
                            <div class="task-date">
                                <i class="far fa-calendar"></i> Créée ${this.formatDate(task.createdAt)}
                                ${task.updatedAt > task.createdAt ? ` • Modifiée ${this.formatDate(task.updatedAt)}` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-btn delete" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Ajouter les écouteurs d'événements pour les tâches
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const taskId = e.target.closest('.task-item').dataset.id;
                    this.toggleTaskComplete(taskId);
                });
            });
            
            document.querySelectorAll('.task-btn.edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = e.target.closest('.task-item').dataset.id;
                    this.openEditModal(taskId);
                });
            });
            
            document.querySelectorAll('.task-btn.delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = e.target.closest('.task-item').dataset.id;
                    this.deleteTask(taskId);
                });
            });
        }
    }

    // Échapper le HTML pour éviter les injections
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialiser l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});