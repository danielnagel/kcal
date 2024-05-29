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
sudo ln -s /home/daniel/git/kcal/backup-kcal.service /etc/systemd/system/backup-kcal.service
sudo ln -s /home/daniel/git/kcal/backup-kcal.timer /etc/systemd/system/backup-kcal.timer

# activate
sudo systemctl enable backup-kcal.timer
sudo systemctl start backup-kcal.timer
```

## logs

```bash
# after service was activated
journalctl -u kcal -u backup-kcal -f
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
sudo systemctl disable backup-kcal.timer
sudo systemctl stop backup-kcal.timer
```
