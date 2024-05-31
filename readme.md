# kcal

> Web Server for tracking daily calorie intake.

With the kcal web server, daily nutrition can be tracked.
Additionally, today's calorie intake is summarized on the homepage.
Furthermore, the current weight and waist can be entered and tracked over time in a graph.

This project runs exclusively on a Debian-based Linux system.
The project has been tested on a Raspberry Pi 3 with the operating system Raspbian GNU/Linux 12.
Node version 21 is required

## install

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
