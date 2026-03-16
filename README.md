# to-do-list-app

# CREATING FOLDER LOCALLY
cd Desktop
mkdir taskflow-workshop
cd taskflow-workshop

# CLONE THE REPO
git clone https://github.com/THEIR-USERNAME/taskflow-app.git
cd taskflow-app
code .

# PUSH THE CHANGES
git status
git checkout -b feature/my-changes
git add .
git commit -m "Personalised the app with my name"
git push origin feature/my-changes

# GITHUB LOGIN ON VS
1. GitHub → click profile photo top right → **Settings**
2. Scroll all the way down → **Developer settings**
3. **Personal access tokens → Tokens**
4. **Generate new token**
5. Give it a name: `workshop-token`
6. Expiration: 90 days
7. Tick **repo** 
8. Click **Generate token**
9. **Copy it immediately** — GitHub only shows it once
