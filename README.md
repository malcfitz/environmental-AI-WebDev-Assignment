Here's the README content in markdown — copy this into a README.md file at the root of your repo:

markdown
# Environmental AI

A full-stack ASP.NET Core MVC website exploring how artificial intelligence is being used to tackle environmental sustainability challenges — built as part of the Web Design and Programming unit at the University of Canberra.

## Features

- **Home & Map pages** — overview of AI's role in sustainability, plus an interactive world map with category filters (Energy, Agriculture, Supply Chain, Carbon Offset) and animated statistics counters
- **AI Image Gallery** — a community-style gallery of AI-generated images with prompts and generator credits, including a like/voting system
- **Role-based access control** — ASP.NET Core Identity with admin/user roles; admins can edit and delete gallery entries, users can contribute new ones
- **File upload handling** — image uploads stored server-side with unique filenames
- **Responsive design** — built with Bootstrap for mobile and desktop layouts

## Tech Stack

- **Backend:** ASP.NET Core MVC (C#)
- **Database:** SQLite via Entity Framework Core
- **Auth:** ASP.NET Core Identity (role-based)
- **Frontend:** Razor views, Bootstrap, vanilla JS
- **Frameworks/Tools:** EF Core migrations, ASP.NET Core Identity UI

## Running Locally

1. Clone the repo
2. Restore dependencies:
```
   dotnet restore
```
3. Apply EF Core migrations to create the local SQLite database:
```
dotnet ef database update
```
4. Run the app:
```
dotnet run
```

## About

Built by Malcolm Fitzgerald as part of coursework at the University of Canberra. All non-company logo images sourced from Canva AI / ChatGPT image generation; company logos belong to their respective owners.
