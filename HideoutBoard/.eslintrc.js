module.exports = {
    "env": {
        "node" : true,
        "es6": true,
        "react-native/react-native": true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        sourceType : "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-native"],

    "rules": {
        "@typescript-eslint/explicit-function-return-type" : "off",
        "@typescript-eslint/no-empty-function" : ["error", {"allow" : ["constructors"]}],
        "@typescript-eslint/no-explicit-any" : ["warn"],
        "@typescript-eslint/interface-name-prefix" : "off",
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double",
            "avoid-escape"
        ],
        "semi": [
            "error",
            "always"
        ],
        "dot-location" : ["error", "property"],
        "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next" }],
        "no-console" : "off",
        "no-inner-declarations" : "off",
        "consistent-return": "error",
        "no-eval" : "error",
        "no-eq-null" : "error", //=== null only
        "no-new" : "error", //only in assign
        "no-proto" : "error",
        "no-return-assign" : "error",
        "no-return-await" : "error",
        "no-with" : "error",
        // "no-use-before-define" : ["error", "nofunc"],
        //style,
        "camelcase" : "error",
        "comma-spacing" : "error",
        "func-call-spacing" : "error",
        //"key-spacing" : ["error", {"beforeColon" : true}], //I don't care for beforeColon...
        "max-len" : ["error", {
            "code" : 125,
            "ignoreComments" : true,
            "ignoreUrls" : true,
            "ignoreStrings" : true,
            "ignoreTemplateLiterals" : true,
            "ignoreRegExpLiterals" : true
        }],
        "max-lines" : ["error", {
            "max" : 300,
            "skipComments" : true
        }],
        "max-nested-callbacks" : ["error", 7],
        "no-array-constructor" : "error",
        "no-bitwise" : ["error", { "allow": ["~"] }],
        "no-continue" : "error",
        "no-lonely-if" : "error",
        "no-mixed-operators" : "error",
        "no-multi-assign" : "error",
        "no-multiple-empty-lines" : "error",
        "no-new-object" : "error",
        "no-restricted-syntax" : ["error",
            "WithStatement", //with
            "ForOfStatement", //remove for loop.
            "ForInStatement", //remove for in, for of -> use Array.forEach
            // "ForStatement",
            // "SwitchStatement", //remove switch -> use object/Map instead.
            // "SwitchCase",
        ],
        "no-trailing-spaces" : "error",
        "no-unneeded-ternary" : ["error", {"defaultAssignment" : false}],
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position" : "error",
        "object-curly-newline" : "error",
        //"object-curly-spacing" : "error",
        "one-var" : ["error", "never"],
        "operator-linebreak" : ["error", "after"],
        "space-before-blocks" : "error",
        "template-tag-spacing" : "error",
        "no-duplicate-imports" : "error",
        "no-useless-computed-key" : "error",
        "no-useless-rename" : "error",
        "no-var" : "error",
        "prefer-const" : ["error", {"ignoreReadBeforeAssign" : false}],
        "prefer-template" : "error",
        "template-curly-spacing" : "error",
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,
        // "react-native/no-color-literals": 2,
        "react-native/no-raw-text": 2,
        "react-native/no-single-element-style-arrays": 2,
    }
};