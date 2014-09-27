FROM shepmaster/nginx-template-image
ADD htpasswd /etc/nginx/.htpasswd

CMD ['nginx']
