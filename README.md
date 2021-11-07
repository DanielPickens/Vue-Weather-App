# Vue Weather APP


## Introduction
This project is a  Weather Application that calls data from a RestAPI

## ScreenShot




## Quickstart

### 
**First, Clone and Install dependence**
```
git clone https://github.com/DanielPickens/Vue-Weather-App
cd Vue Weather App
npm start

```

**Second, Init db and run**
```
# npm build
# npm start
```

### Use Docker 
**First, Build image and run in background**
```
docker-compose up -d
```
**Second, enter container and add fake data**
```
docker-compose exec web sh

```
### About Config
The default admin account is:

username|password|role
---|---|---
admin|admin|super administrator
editor|editor|editor
op|op|operator

If the js files has been modified, you need to:
```
npm install
npm run build
```

