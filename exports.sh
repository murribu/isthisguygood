yarn build
cd cdk && npm run build && cdk synth && cdk deploy &> ../cdkdeployresult.txt
cd .. && node parseResults.js cdkdeployresult.txt