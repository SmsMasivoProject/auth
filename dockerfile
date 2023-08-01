
FROM node:18-alpine
 
WORKDIR /user/src/app
 
COPY . .
 
# RUN yarn ci --omit=dev
 
RUN yarn run build
 
USER node
 
CMD ["yarn", "run", "start:prod"]