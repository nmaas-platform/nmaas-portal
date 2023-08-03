FROM alpine:3.16 as builder

COPY . /build
WORKDIR /build

RUN apk add nodejs npm
RUN npm install -g @angular/cli
RUN npm i --force --legacy-peer-deps
RUN ng build --base-href / --configuration production

FROM nginx:1.23-alpine
MAINTAINER nmaas@lists.geant.org

ARG webdir=/usr/share/nginx/html

RUN mkdir -p ${webdir}/config
RUN apk add gettext

COPY --from=builder /build/build/app/ ${webdir}
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/config.template.json ${webdir}/config/config.template.json
COPY docker/run_portal.sh /scripts/run_portal.sh

RUN chmod +x /scripts/run_portal.sh
CMD /scripts/run_portal.sh && tail -f /dev/null
