FROM golang:1.24.2-alpine as builder

ARG GO_BUILD_COMMAND="go build -tags static_all"

# Install some build deps + ssh tools for the setup below.
RUN apk update && apk --no-cache add  build-base  git bash  coreutils openssh  openssl


# Create the directory where the application will reside
RUN mkdir -p /go/src/github.com/feildrixliemdra/library-backend


WORKDIR /go/src/github.com/feildrixliemdra/library-backend

COPY . .

# application builder step
RUN go install -v github.com/swaggo/swag/cmd/swag@v1.7.8 && \
    swag init -g internal/router/router.go && \
    go mod download && \
    go mod tidy && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o library-backend .

# STEP 2 build a small image
# Set up the final (deployable/runtime) image.
FROM alpine:3.10.2


# setup package dependencies
RUN apk --no-cache update && apk --no-cache  add  ca-certificates bash jq curl

ENV BUILDDIR=/go/src/github.com/feildrixliemdra/library-backend
ENV PROJECT_DIR=/opt/library-backend

# Setting timezone
ENV TZ=Asia/Jakarta
RUN apk add -U tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR $PROJECT_DIR

# Copy the binary
COPY --from=builder $BUILDDIR/library-backend library-backend
COPY --from=builder $BUILDDIR/migration migration

EXPOSE 8080

CMD ["sh","-c", "/opt/library-backend/library-backend"]