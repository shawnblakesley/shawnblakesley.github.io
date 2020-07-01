FROM alpine

RUN apk update && apk add --update alpine-sdk go
ENV GOPATH=/gopath
COPY go_root /gobuild
WORKDIR /gobuild
RUN go mod download
RUN go install server

FROM alpine

COPY --from=0 /gopath/bin/server /usr/local/sbin/server
COPY dist /static/
RUN mkdir -p /var/log/server

EXPOSE 80
CMD ["/usr/local/sbin/server", "-dir=/static/"]