FROM mcr.microsoft.com/playwright:v1.34.0-jammy

COPY . /rfslic_tests

WORKDIR /rfslic_tests

RUN npm ci

RUN npx playwright install --with-deps

RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME