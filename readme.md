# kcal

> Web Server for tracking daily calorie intake.

<p align="center">
    <img src="/docs/icon.png" />
</p>

With the kcal web server, daily nutrition can be tracked.
Additionally, today's calorie intake is summarized on the homepage.
Furthermore, the current weight and waist can be entered and tracked over time in a graph.
The simple user management is file-based.
The username is stored in the browser's localStorage.
If there is no name in localStorage, it is requested through a dialog.
The username is appended to each request to the server to load the data from the correct file.

This project runs exclusively on a Debian-based Linux system.
The project has been tested on a Raspberry Pi 3 with the operating system Raspbian GNU/Linux 12.
Node version 21 is required

## frontend

When the browser visits the website for the first time,
the user is prompted to provide a name, i.e., to sign in.

<p align="center">
    <img src="/docs/login.png" width="300"/>
</p>

The current calorie intake can be viewed on the home page.

<p align="center">
    <img src="/docs/home.png" width="300"/>
</p>

Additional calories can be entered.

<p align="center">
    <img src="/docs/k.png" width="300"/>
</p>

All entered calories can be viewed, in descending order.
Only today's date shows a detailed view of the entered data.

<p align="center">
    <img src="/docs/lsk.png" width="300"/>
</p>

A dialog opens, when clicked on a row, which allows to update or delete the selected entry.

<p align="center">
    <img src="/docs/lsk-dialog.png" width="300"/>
</p>


Weight can be entered.

<p align="center">
    <img src="/docs/w.png" width="300"/>
</p>

Weight can also be recorded and viewed in a graph or in a list.

<p align="center">
    <img src="/docs/lsw.png" width="300"/>
</p>

A dialog opens, when clicked on a row, which allows to update or delete the selected entry.

<p align="center">
    <img src="/docs/lsw-dialog.png" width="300"/>
</p>

User preferences can be configured

- daily calories target, seen on the home screen
- weight target, takes effect on the weight chart view
- user color, changes the accent color of the application
- kcal history count, daily calories target history, seen on the home screen

<p align="center">
    <img src="/docs/conf.png" width="300"/>
</p>

User configuration

- can be reached when clicking on update user on the configuration page
- update, the current user name
- change, the user to another one, if the user exists
- new, create a new user

<p align="center">
    <img src="/docs/conf-user.png" width="300"/>
</p>

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
I also tried to migrate the project to the [deno runtime](https://deno.com/).
But it [currently doesn't support arm32 architecture](https://github.com/denoland/deno/issues/2295).

### What I Learned

1. Working with systemd units (services and timers).
2. Refreshed knowledge of Bash scripting.
3. Refreshed knowledge of Express.
4. Using Tabulator and Chart.js.
5. Unit testing with the Node Test Runner.
6. Caching using service workers.
7. Using the local storage to persist data from the form,
   when page is offline, to prevent data loss.
8. Web app manifest.
9. Refreshed knowledge on eslint.
10. Refreshed knowledge on github workflows.
11. Simple, file-based, user mangement.
12. Working with the browsers local storage