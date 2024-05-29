# kcal

Collect data about what you've eaten, in your own home network.

## installation

### server

```bash
chmod +x ~/git/kcal/start.sh
sudo ln -s /home/daniel/git/kcal/kcal.service /etc/systemd/system/kcal.service

# start
sudo systemctl start kcal.service
```

### backup

```bash
chmod +x ~/git/kcal/backup.sh
sudo ln -s /home/daniel/git/kcal/kcal-backup.service /etc/systemd/system/kcal-backup.service
sudo ln -s /home/daniel/git/kcal/kcal-backup.timer /etc/systemd/system/kcal-backup.timer

# activate
sudo systemctl enable kcal-backup.timer
sudo systemctl start kcal-backup.timer
```

## logs

```bash
# after service was activated
journalctl -u kcal -u kcal-backup
```

## uninstall

### server

```bash
# deactivate service
sudo systemctl stop kcal.service
```

### backup

```bash
# deactivate service
sudo systemctl disable kcal-backup.timer
sudo systemctl stop kcal-backup.timer
```
