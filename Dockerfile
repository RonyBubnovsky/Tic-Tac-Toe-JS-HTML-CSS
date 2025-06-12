FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY tic-tac-toe.css /usr/share/nginx/html/tic-tac-toe.css
COPY tic-tac-toe.js /usr/share/nginx/html/tic-tac-toe.js