@echo off
echo ========================================
echo Pushing to GitHub - UI Branch
echo ========================================
echo.

echo Step 1: Checking current branch...
git branch
echo.

echo Step 2: Checking status...
git status
echo.

echo Step 3: Adding all changes...
git add .
echo.

echo Step 4: Committing changes...
git commit -m "feat: integrate 3D globe, cleanup codebase, and organize documentation"
echo.

echo Step 5: Pushing to GitHub...
git push origin ui
echo.

echo ========================================
echo Done! Check the output above for any errors.
echo ========================================
pause
