# kcal

Collect data about what you've eaten, in your own home network.

## install

```bash
# register service
sudo ln -s /home/daniel/git/kcal/kcal.service /etc/systemd/system/kcal.service
cp install-and-start-kcal.sh ~/bin
chmod +x ~/bin/install-and-start-kcal.sh
sudo systemctl start kcal.service
```