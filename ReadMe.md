

⚙️  Setup

Navigate to the backend directory:
cd ms-coffeeShop/ms-coffeeShop

Build the backend application:
ymvn clean package

Rename the generated JAR file in target folder to backend.jar
Move the JAR file to the frontend's backend folder:
 ./front/backend/
Note: Repeat these steps whenever you make changes to the backend code.

To generate the frontend dist folder
npm run build

💻 Frontend Development
🔧 Development Mode
npm run dev
npm run electro:dev


🚀 Production Mode
Run the Electron application in production mode:
Before packaging make sure to test the app
npm run electro:start
📦 Building Windows Application Package

Generate the Windows application package:
npm run package

The packaged application will be available in the release-builds folder.

💾 Data Management

Application data is stored in the data folder
To reset application data, delete the contents of the data folder
Make sure to backup important data before deletion

⚠️ Important Notes

Always stop running servers before packaging the application
Backup data before deleting the data folder
Backend JAR must be renamed and moved to the correct location after each backend change
The packaged application will be generated in the release-builds directory
