<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/899f054c-f49d-4296-8cb7-fdf6a184a9d1

## Run Locally

**Prerequisites:** Node.js

### Quick Start (Single Device)

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Multiplayer (Two Devices)

For cross-device multiplayer, you'll need to run the Socket.io backend server:

1. In a new terminal, navigate to the server folder:

   ```bash
   cd server
   npm install
   npm start
   ```

2. Start the frontend (in another terminal):

   ```bash
   npm run dev
   ```

3. Find your local IP address:
   - Windows: Open PowerShell and run `ipconfig` (look for IPv4 Address like `192.168.1.x`)

4. On Device 1: Open http://localhost:3000, create a match, copy the session code

5. On Device 2: Open http://[YOUR_LOCAL_IP]:3000, join the match with the session code

See [server/README.md](server/README.md) for detailed server setup instructions.
