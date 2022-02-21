FROM node:12.18.3


RUN git clone https://github.com/DanielPickens/Vue-Weather-App

# Change directories into what got checked out.
WORKDIR /Vue-Weather-App
# All of the files are already there, so we only need to
RUN npm install

EXPOSE 8000 9000 3000 8080


CMD ["npm", "develop", "-H", "0.0.0.0" ]
