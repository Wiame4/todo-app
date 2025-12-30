# Todo App

Une application moderne de gestion de tâches développée en HTML5, CSS3 et JavaScript ES6.

## ✨ Fonctionnalités

- **Ajouter des tâches** : Interface intuitive pour créer de nouvelles tâches
- **Marquer comme terminées** : Cochez les tâches accomplies
- **Modifier les tâches** : Éditez le texte des tâches existantes via une modal
- **Supprimer des tâches** : Supprimez individuellement ou en lot
- **Filtrage intelligent** : Affichez toutes les tâches, seulement les actives ou les terminées
- **Tri flexible** : Triez par date (récent/ancien) ou par nom (A-Z/Z-A)
- **Mode sombre/clair** : Basculez entre les thèmes selon vos préférences
- **Persistance des données** : Sauvegarde automatique dans le LocalStorage
- **Design responsive** : Optimisé pour tous les appareils
- **Interface moderne** : Animations fluides et design épuré

## 🚀 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS et animations
- **JavaScript ES6** : Classes, modules et API modernes
- **LocalStorage API** : Persistance des données côté client
- **Font Awesome** : Icônes vectorielles
- **Google Fonts** : Police Poppins

## 📁 Structure du projet

```
todo-app/
├── index.html          # Page principale
├── style.css           # Styles CSS
├── app.js              # Logique JavaScript
├── README.md           # Documentation
```

## 🛠️ Installation et utilisation

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/votre-utilisateur/todo-app.git
   cd todo-app
   ```

2. **Ouvrir dans un navigateur** :
   - Ouvrez le fichier `index.html` dans votre navigateur web
   - Ou utilisez un serveur local pour une meilleure expérience

3. **Utilisation** :
   - Ajoutez des tâches dans le champ de saisie
   - Utilisez les filtres pour organiser votre vue
   - Basculez vers le mode sombre si souhaité
   - Vos données sont automatiquement sauvegardées

## 🎨 Fonctionnalités techniques

### Classes JavaScript
- `Task` : Représente une tâche individuelle avec ses propriétés
- `TodoApp` : Gestionnaire principal de l'application

### Persistance
- Sauvegarde automatique dans le LocalStorage
- Chargement des tâches au démarrage
- Synchronisation en temps réel

### Interface utilisateur
- Modals pour l'édition et la confirmation
- Animations CSS fluides
- Design responsive avec media queries
- Thème sombre/clair dynamique

## 📱 Compatibilité

- Navigateurs modernes supportant ES6
- LocalStorage activé
- Responsive sur mobile, tablette et desktop

## 👤 Auteur

Développé avec ❤️ par **Wiame**

## 📄 Licence

Ce projet est open source. N'hésitez pas à le modifier et l'adapter selon vos besoins.

---

*Todo App - Gérez vos tâches efficacement !*
