example

```
docker run \
  --publish 8080:80 \
  --publish 8443:443 \
  --volume /tmp/nginx-config:/etc/nginx/sites-templates:ro \
  --volume /tmp/nginx-logs:/var/log/nginx \
  --link my-rails-app:rails \
  nginx
```
