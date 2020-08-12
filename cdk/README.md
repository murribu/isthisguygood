# Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

# 2020 Update

Run `npx cdk synth` and `npx cdk deploy`. This way, it will use the local version of the cdk cli if it's present (which should be 1.57) instead of the global version (which is version 0.x)

# To build and deploy

`yarn && yarn build`
`cd cdk`
`yarn && yarn build && npx cdk synth && npx cdk deploy --require-approval never`