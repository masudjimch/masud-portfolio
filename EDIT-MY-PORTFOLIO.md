# EDIT MY PORTFOLIO

This guide helps you update your portfolio website without editing HTML, CSS, or JavaScript.

## 1. MAIN CONTENT FILE
Open: `data/portfolio.json`

Most website content is stored in this file. After editing: Save -> Commit -> Push. GitHub Pages updates automatically.

## PROFILE
You can change:
- name
- nickname
- title
- shortDescription
- image

Example:
```json
"title": "Doctor | Educator | Technology Enthusiast"
```

## ABOUT
Change the `title` and `description` text inside the `about` section.

## SKILLS
Each skill:
```json
{
  "name": "Medical Education",
  "level": 90
}
```
Use a level from 0 to 100. To add a skill, copy an existing block and add it inside `skills`.

## SERVICES / EXPERTISE
Each service contains:
- number
- icon
- title
- description

Copy an existing service block to add a new one.

## EXPERIENCE / JOURNEY
Change:
- year
- title
- organization
- description

Examples of year: `2024 - Present`, `2022 - 2024`, or `Present`.

## PROJECTS
Each project contains:
- title
- category
- description
- image
- link

If no link is available:
```json
"link": "#"
```

## CONTACT
Update your email and social links inside the `contact` section.

## CHANGING IMAGES
Upload images to:
`assets/images/`

Then update the path, for example:
```json
"image": "assets/images/my-photo.jpg"
```

Use simple filenames and avoid spaces.

## HOW TO EDIT FROM GITHUB
1. Open your GitHub repository.
2. Open `data/portfolio.json`.
3. Click the pencil icon (Edit).
4. Change the required information.
5. Click **Commit changes**.
6. Wait for GitHub Pages to deploy the update.

## IMPORTANT JSON RULES
1. Keep quotation marks around text.
2. Do not remove `{}`, `[]`, or commas unless you understand JSON.
3. Separate list items with commas.
4. Do not put a comma after the final item in a list.
5. Usually, change only the text or numbers on the right side of `:`.

Good:
```json
"name": "Md. Moshiur Rahman"
```

## QUICK CHECKLIST
Open only:
`data/portfolio.json`

Edit:
- Profile
- About
- Skills
- Services
- Experience
- Projects
- Contact

Then: Save -> Commit -> Push.

Live website:
https://masudjimch.github.io/masud-portfolio/

## FINAL TIP
Before making a large change, keep a copy of the old text. If something goes wrong, GitHub also lets you review and restore previous versions.
