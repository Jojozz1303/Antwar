# Extension mBlock - Antwar 🐜⚔️

Extension mBlock pour créer une **simulation de guerre de fourmis** interactive !

## 🚀 Installation

### Option 1 : Via mBlock Extension Builder
1. Allez sur [mBlock Extension Builder](https://ext.mblock.cc/)
2. Cliquez sur **Import Extension**
3. Téléchargez le fichier `extension.js`
4. Testez dans l'éditeur mBlock

### Option 2 : Installation locale
```bash
npm install
npm run build
```

## 📦 Blocs disponibles

### Création et gestion
- **créer une fourmi à [X] [Y] avec énergie [ENERGY]** - Crée une fourmi aux coordonnées spécifiées
- **ajouter nourriture à [X] [Y]** - Ajoute une source de nourriture
- **réinitialiser la simulation** - Efface toutes les fourmis et la nourriture

### Statistiques
- **nombre de fourmis** - Retourne le nombre de fourmis actives
- **quantité de nourriture** - Retourne la quantité totale de nourriture disponible

### Simulation
- **déplacer toutes les fourmis** - Lance un pas de simulation
- **vitesse simulation [SPEED]** - Contrôle la vitesse (1-10)

## 💡 Exemple d'utilisation

```scratch
quand le drapeau vert est cliqué
réinitialiser la simulation

créer une fourmi à 100 100 avec énergie 100
créer une fourmi à 150 150 avec énergie 100
créer une fourmi à 200 100 avec énergie 100

ajouter nourriture à 300 300
ajouter nourriture à 400 400

répéter indéfiniment
  déplacer toutes les fourmis
  attendre 0.1 secondes
  dire (nombre de fourmis)
fin
```

## 🎮 Comportements des fourmis

- Les fourmis se déplacent aléatoirement
- Elles recherchent la nourriture à proximité
- Chaque mouvement consomme de l'énergie
- Manger augmente l'énergie
- Les fourmis sans énergie disparaissent

## 📝 Structure des fichiers

```
mblock-extension/
├── extension.js      # Code principal
├── manifest.json     # Métadonnées
├── package.json      # Dépendances
└── README.md         # Ce fichier
```

## 🔧 Améliorations futures

- [ ] Phéromones et communication entre fourmis
- [ ] Colonies avec reine
- [ ] Niveaux d'intelligence IA
- [ ] Visualisation graphique
- [ ] Sauvegarde/chargement de simulations

## 👨‍💻 Auteur

**Jojozz1303**  
Projet : [Antwar](https://github.com/Jojozz1303/Antwar)

## 📄 Licence

MIT
