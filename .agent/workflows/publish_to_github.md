---
description: How to publish the project to GitHub
---

# Publishing Everymon to GitHub

This workflow will guide you through pushing your local code to a new GitHub repository.

## Prerequisites
- A GitHub account.
- Git installed locally.

## Steps

1.  **Initialize Git (if not done)**
    ```bash
    git init
    # // turbo
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create Repository on GitHub**
    - Go to [github.com/new](https://github.com/new).
    - naming it `EverymonV1.0`.
    - **Do not** initialize with README/gitignore (you already have them).
    - Click **Create repository**.

3.  **Link and Push**
    - Copy the commands under "…or push an existing repository from the command line".
    - They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/EverymonV1.0.git
    git branch -M main
    git push -u origin main
    ```
    - Run these commands in your terminal.

4.  **Verification**
    - Refresh your GitHub repository page to see your code.
