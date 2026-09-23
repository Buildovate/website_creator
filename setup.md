# Local setup

## For Joe

You do not install software yourself. Open Codex in this repository (or paste the repo in) and say:

> Read setup.md and set up my local environment.

When Windows, Docker Desktop, winget, Homebrew, or Codex asks to install, allow, or elevate, click **Accept**, **Allow**, or **Yes**. That includes User Account Control and Docker's first-run window. If Windows asks for a reboot, reboot, reopen Codex in this folder, and send the same sentence again.

Give an API key only if Codex asks. Put it in `aws/env/docker.env` on this machine. Do not paste keys into the chat. Do not commit that file.

When Codex says the app is up, open http://localhost:8080.

## For Codex

Set up this repo on Joe's computer. Follow the checklist below in order. Install every missing tool. Do not ask Joe to pick an installer, a port, a branch, or a database. The only question you may ask is whether he wants AI features, which needs one `OPENAI_API_KEY`. If he says no, or does not have a key, leave the key blank and continue.

Do not commit. Do not push. Do not print secrets, `docker.env`, or `docker compose config` (that command expands the key). Do not put real keys in `aws/env/docker.env.example`. Do not deploy. Do not install the AWS CLI, Cognito tooling, the Elastic Beanstalk CLI, LocalStack, or Python for this local run.

Use the Docker Compose stack (Postgres 16, MinIO, app on port 8080). Use the pglite path in the last section only if Docker cannot be installed or still fails after a reboot.

Done when `GET /healthz` returns HTTP 200 and JSON with `ok: true`, `environment: "local"`, `database.ok: true`, and `authMode: "dev-header"`, and you have told Joe the URLs in step 9.

## Software to install

Install anything in this table that is missing or too old. npm is the npm that ships with Node. A code editor is not required.

| Tool | Check | Required version |
|---|---|---|
| Git | `git --version` | any current Git (clone and pull) |
| Docker | `docker info` and `docker compose version` | Compose v2.24 or newer. On Windows and macOS that is Docker Desktop 4.28 or newer. On Windows use the WSL2 backend when Docker asks for it. |
| Node.js | `node -v` and `npm -v` | Node.js 22.13 or newer. The image is `node:22-bookworm-slim`. README requires 22.13+ for the local toolchain. Prefer the Node 22 line when Node is not already installed. |
| curl | `curl.exe --version` on Windows, `curl --version` elsewhere | any current curl. On Windows, PowerShell `curl` is `Invoke-WebRequest`. Always call `curl.exe`. |

Optional: Windows Terminal (`Microsoft.WindowsTerminal`). Do not block setup on it.

Not required for a local run: AWS CLI, Cognito, Elastic Beanstalk, LocalStack, Python, Wrangler.

After each installer, refresh `PATH` in the current shell before the version check. On Windows PowerShell:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Open a new terminal if the command is still not found. `docker` may stay missing until Docker Desktop has been started once; the Windows CLI is also `C:\Program Files\Docker\Docker\resources\bin\docker.exe`.

## Checklist

### 1. Repository root

Work in the root of `website_creator`. The root contains `docker-compose.yml`, `Dockerfile`, `package.json`, and `aws/env/docker.env.example`.

If the current directory is that root, stay here. If Git works and the tree is clean, check out `develop` and pull:

```powershell
git fetch origin
git checkout develop
git pull origin develop
```

If the tree has local changes, do not reset, clean, or stash them. Continue with the files that are already here.

If this folder is not the repo, clone it and enter it:

```powershell
git clone https://github.com/Buildovate/website_creator.git
cd website_creator
git checkout develop
```

Use the same commands in bash. Confirm the four paths above exist before continuing.

### 2. Detect the OS and install what is missing

Detect the OS, then run only the installs that fail the checks in the table. Prefer winget on Windows when `winget --version` works. Accept package agreements yourself so Joe only sees the OS approval prompt. Do not use `sudo` on Windows.

#### Windows (PowerShell)

```powershell
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
winget install --id OpenJS.NodeJS.22 -e --source winget --accept-package-agreements --accept-source-agreements
winget install --id Docker.DockerDesktop -e --source winget --accept-package-agreements --accept-source-agreements
```

`curl.exe` is included with Windows 10 and 11 at `C:\Windows\System32\curl.exe`. If that file is missing:

```powershell
winget install --id cURL.cURL -e --source winget --accept-package-agreements --accept-source-agreements
```

If `winget` is not available, use Chocolatey (`choco install git docker-desktop nodejs-lts -y`) and then check `node -v`. If that Node is older than v22.13.0, install `OpenJS.NodeJS.22` with winget instead. Do not leave an older Node in place.

Docker Desktop on Windows needs the WSL2 backend. If `wsl --status` fails or Docker says WSL2 is required:

```powershell
wsl --install
wsl --set-default-version 2
```

A reboot is normal. Tell Joe to reboot, reopen Codex in this repo, and say "read setup.md and set up my local environment" again. After the reboot, resume at step 2 and skip any tool that already passes its version check, then start Docker in step 3. Do not skip a required reboot, and do not switch to the fallback only because a reboot was requested.

#### macOS

Install Homebrew if `brew` is missing, and tell Joe to accept its prompt. Then:

```bash
brew install git
brew install node@22
brew install --cask docker
brew link --overwrite --force node@22
```

`curl` is already on macOS. If `node -v` is still below v22.13.0, put Homebrew's `node@22` bin directory first on `PATH` and check again.

#### Debian and Ubuntu

```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
```

Install Node.js 22 from NodeSource, then check `node -v`:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

If that script fails, install the newest 22.x tarball from `https://nodejs.org/dist/latest-v22.x/` onto `PATH`. Do not accept Ubuntu's default `nodejs` package when it is older than v22.13.0.

Install Docker Engine and the Compose v2 plugin (Compose v2.24 or newer). Docker Desktop is optional on Linux. The Docker convenience script sets up the apt repository and installs the engine plus `docker-compose-plugin`:

```bash
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sudo sh /tmp/get-docker.sh
sudo systemctl enable --now docker
```

If `docker info` says permission denied, run `sudo usermod -aG docker "$USER"` and use `sudo docker` for the rest of this session. The group change applies on the next login. Do not stop setup to make Joe log out.

### 3. Start Docker and check Compose

Start Docker and wait until `docker info` exits 0 before any `docker compose` command. Poll every few seconds for up to five minutes.

Windows:

```powershell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
docker info
docker compose version
```

macOS: `open -a Docker`, then the same two checks.

Linux: `sudo systemctl enable --now docker`, then `docker info` (or `sudo docker info`).

`docker compose version` must report v2.24 or newer (the `docker compose` plugin, not the old `docker-compose` binary). If it is older, update Docker Desktop or the `docker-compose-plugin` package and check again.

If Docker still cannot run after a reboot and a five-minute wait, go to the fallback section. Do not invent a second database.

### 4. Local env file

From the repo root, create `aws/env/docker.env` only when it is missing.

PowerShell:

```powershell
if (-not (Test-Path aws\env\docker.env)) {
  Copy-Item aws\env\docker.env.example aws\env\docker.env
}
```

bash:

```bash
test -f aws/env/docker.env || cp aws/env/docker.env.example aws/env/docker.env
```

Leave every secret blank unless Joe provides one in step 5. `aws/env/docker.env` is gitignored. Compose loads `aws/env/docker.env.example` first and the gitignored copy second, so the copy overrides the blanks. Never commit `docker.env`. Never write a real key into the example file.

The example already sets `APP_ENV=local`, `NODE_ENV=development`, `AUTH_MODE=dev-header`, `MIGRATE_ON_BOOT=1`, the Compose `DATABASE_URL` (`postgres` hostname, user and password `website_creator`, database `website_creator`), and the MinIO endpoint `http://minio:9000` with user and password `minioadmin`. Do not change those hostnames to `localhost`. They resolve only inside the Compose network.

### 5. OpenAI key

Ask once: does Joe want AI features on this machine?

- If no, leave `OPENAI_API_KEY` empty. `/healthz` will report `openai.configured: false`. That is a successful smoke test.
- If yes, have Joe put the key only in `aws/env/docker.env` (Notepad on Windows, or another local editor). Do not ask him to paste it into chat. If a key appears in chat anyway, write it into `OPENAI_API_KEY` in that file and do not repeat the value. Do not `Get-Content` or `cat` the file afterward.

Other provider keys in that file (Google, Yelp, Zoom, Resend, Twilio) stay blank. Do not ask for them.

### 6. Ports

The published host ports are 8080 (app), 5432 (Postgres), 9000 (MinIO API), and 9001 (MinIO console). See the left-hand numbers in `docker-compose.yml`.

Check listeners:

```powershell
Get-NetTCPConnection -LocalPort 8080,5432,9000,9001 -State Listen -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess
```

```bash
ss -ltnp | grep -E ':8080|:5432|:9000|:9001' || true
```

If the listener is a previous `website-creator` Compose project, stop it from this repo with `docker compose down`. If the port belongs to something else, do not kill that process. Change only the host side of the mapping (the number on the left):

```yaml
ports:
  - "8081:8080"
```

Leave the container port (the number on the right) as it is. Leave `DATABASE_URL` on host `postgres` and port `5432`, and leave `S3_ENDPOINT=http://minio:9000`. Those names are inside the Compose network. From the host, use `localhost` and whatever host port you published. If you move 8080, use that new host port in the health check.

### 7. Start the stack

From the repo root, build and start detached so you can run the health check:

```powershell
docker compose up --build -d
```

`npm run docker:up` is the same build in the foreground (`docker compose up --build` with no `-d`). Use the detached command for this setup. On Linux, prefix with `sudo` if step 2 still requires it.

Then:

```powershell
docker compose ps
docker compose logs --tail 100 app
```

`postgres` and `minio` should become healthy, `minio-init` should exit 0, and `app` should become healthy. The app health check waits about 40 seconds before its first try, then retries. The first start also builds the image and applies migrations (`MIGRATE_ON_BOOT=1`).

### 8. Wait until the app is healthy

Poll for up to three minutes. Connection refused in the first minute means the process is still starting. HTTP 503 means the database check failed; wait, read `docker compose logs app postgres`, and try again. Do not report success on 503.

Windows (use `curl.exe`, not `curl`):

```powershell
curl.exe -fsS http://localhost:8080/healthz
```

macOS and Linux:

```bash
curl -fsS http://localhost:8080/healthz
```

Replace `8080` if step 6 moved the host port.

Require HTTP 200 and JSON with all of these:

- `ok: true`
- `environment: "local"`
- `database.ok: true`
- `authMode: "dev-header"`

`openai.configured` is `false` when the key is blank and `true` when `docker.env` supplied a key. Either value is fine for this smoke test. `/healthz` does not call OpenAI.

The handler also returns `service: "website-creator"`. `database.ms` is how long `SELECT 1` took.

### 9. Tell Joe these URLs

Say this in plain sentences after the health check passes:

- App: http://localhost:8080
- MinIO console: http://localhost:9001 (user `minioadmin`, password `minioadmin`)
- MinIO API: http://localhost:9000
- Postgres from this computer: `localhost` port 5432, database `website_creator`, user `website_creator`, password `website_creator`

Those passwords are the local Compose defaults in `docker-compose.yml`. They are not preview or production credentials. Inside the Compose network the app uses hostname `postgres` and `http://minio:9000`. Those names do not resolve on the host.

### 10. Local API auth

Local mode is `AUTH_MODE=dev-header` from `aws/env/docker.env.example`. Send these headers on API requests:

- `x-buildovate-user-id`
- `x-buildovate-user-email`

```powershell
curl.exe -fsS http://localhost:8080/api/session -H "x-buildovate-user-id: local-user" -H "x-buildovate-user-email: you@example.com"
```

`dev-header` is for this machine only. Do not set `AUTH_ALLOW_DEV_HEADERS`. Do not describe these headers as a preview or production login.

### 11. Stop and start again

Stop, and keep the database and object volumes:

```powershell
docker compose down
```

`npm run docker:down` is the same command. Bring the stack back with:

```powershell
docker compose up --build -d
```

`docker compose down -v` deletes the `postgres_data` and `minio_data` volumes (the local database and uploaded objects). Do not run it unless Joe asked to wipe local data.

After a later edit to `docker.env`, recreate the app container so it reads the file again. Do not print the resolved environment:

```powershell
docker compose up -d --force-recreate app
```

### 12. Optional edit loop

Skip this on the first setup. `docker compose up --build` rebuilds the production `Dockerfile`, which is the image Elastic Beanstalk builds. For day-to-day source edits, the dev override bind-mounts the source and uses `Dockerfile.dev` (Elastic Beanstalk does not build that file):

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

`npm run docker:dev` is the same compose command in the foreground. Restart the app container after code changes so it runs `npm run build` again. Compose files and Dockerfiles are LF in Git (`.gitattributes`).

## Fallback when Docker cannot run

Use this only after step 3 fails: Docker is not installable, or `docker info` is still failing after a reboot and a five-minute wait. Say that clearly to Joe. This path has no MinIO console and no Postgres on port 5432. The database is in-process pglite and the bucket is memory. Both are disposable. Data is gone when the process exits unless `PGLITE_DATA_DIR` is set.

Node.js 22.13+ must already be installed. From the repo root:

```powershell
npm ci
npm run build
$env:DATABASE_DRIVER = "pglite"
$env:BUCKET_DRIVER = "memory"
$env:AUTH_MODE = "dev-header"
$env:APP_ENV = "local"
$env:MIGRATE_ON_BOOT = "1"
npm run aws:start
```

bash:

```bash
npm ci
npm run build
DATABASE_DRIVER=pglite BUCKET_DRIVER=memory AUTH_MODE=dev-header APP_ENV=local MIGRATE_ON_BOOT=1 npm run aws:start
```

Leave that process running. It listens on port 8080. Run the same `/healthz` check as step 8 (second terminal). Expect HTTP 200, `ok: true`, `environment: "local"`, `database.ok: true`, and `authMode: "dev-header"`.

Optional names are listed in `aws/env/local.env.example`. Do not commit a filled-in copy. If Joe wants AI features here, set `OPENAI_API_KEY` in the process environment only, and do not echo it. The same auth headers as step 10 apply. Stop the process with Ctrl+C in its terminal.
