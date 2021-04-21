yarn build
cd cdk && npm run build && cdk synth && cdk deploy --all --require-approval never &> ../cdkdeployresult.txt