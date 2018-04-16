# PostgreSQL-101

## NSS Exercise for practice with PostgreSQL & Sequelize

### Builds database of shows, directors, and users. Includes join table for users and their favorite shows(users_favorites).
### Supports GET all shows/directors(joins shows/directors onto directors/shows for quick access to projects at /directors and /shows routes)

### Supports GET single show at /shows/:id utilizing req.params

### Supports POST for adding new director/show/user_favorites

### Supports PATCH for updating shows

### ```http://localhost:3000/director-form``` uses a form to add a new director