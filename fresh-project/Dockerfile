FROM denoland/deno

EXPOSE 8000

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

ADD . /app

RUN deno cache main.ts
RUN deno task build

CMD ["run", "-A", "main.ts"]