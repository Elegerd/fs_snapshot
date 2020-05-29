const rules = require('./webpack.rules');

rules.push(
  ...[
    {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    {
      test: /\.(ttf|woff|woff2|eot)$/,
      use: [
        {
         loader: 'file-loader',
        },
     ],
    }
  ]
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
