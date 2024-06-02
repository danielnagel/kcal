# kcal

> Web Server for tracking daily calorie intake.

With the kcal web server, daily nutrition can be tracked.
Additionally, today's calorie intake is summarized on the homepage.
Furthermore, the current weight and waist can be entered and tracked over time in a graph.

This project runs exclusively on a Debian-based Linux system.
The project has been tested on a Raspberry Pi 3 with the operating system Raspbian GNU/Linux 12.
Node version 21 is required

## frontend

There is a daily overview for calories intake

<img src="/docs/kcal-home.png" style="width: 250px; margin: auto"/>

## install

### setup environment

Before running the `install.sh` script,
you should copy the file `example.env` as follows
and adjust the environment variables to match your environment.
If you don't want to back up your data,
you can leave the `BACKUP_DIRECTORY` environment variable empty.

```bash
# in project dir
cp example.env .env
# update .env
```

With the `install.sh` script, the project can be installed.
If the project has been updated, the same command can be used to update the project.

```bash
./install.sh
```

## logs

After all services have been started,
e.g., by using the `install.sh` script,
the logs can be viewed with the following command.

```bash
journalctl -u kcal -u backup-kcal -f
```

## uninstall

All services can be stopped/disabled as follows.

```bash
# deactivate web server service
sudo systemctl stop kcal.service

# deactivate backup service
sudo systemctl disable backup-kcal.timer
sudo systemctl stop backup-kcal.timer
```

## about

I developed this project to track my daily calorie intake.
Additionally, I used a lightweight technology stack since the Raspberry Pi has limited memory available.
Therefore, I only use an Express server without a frontend framework for this project.
Previously, I used Astro, but due to the limited available memory, I couldn't build on the Raspberry Pi.
The project uses systemd services to run the server or perform backups.
I wanted to see if I could get the project up and running quickly on other Debian-based operating systems using scripts,
and I believe I have succeeded, as described in the installation chapter.
Since I use this project daily, it will continue to evolve.

### What I Learned

1. Working with systemd units (services and timers).
2. Refreshed knowledge of Bash scripting.
3. Refreshed knowledge of Express.
4. Using Tabulator and Chart.js.
5. Unit testing with the Node Test Runner.