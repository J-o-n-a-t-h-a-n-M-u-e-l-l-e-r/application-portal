// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
    rules: {
        "vue/html-self-closing": "off",
        "vue/require-default-prop": "off",
        "vue/html-indent": "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/max-attributes-per-line": "off",
        "vue/html-closing-bracket-spacing": "off",
        "@stylistic/object-curly-spacing": "off",
        "@stylistic/indent": "off",
        "@stylistic/quotes": "off",
        "@stylistic/brace-style": "off",
        "@stylistic/spaced-comment": "off",
        "@stylistic/arrow-parens": "off",
        "@stylistic/member-delimiter-style": "off",
        "@stylistic/comma-dangle": "off",
        "@stylistic/indent-binary-ops": "off",
        "@stylistic/no-trailing-spaces": "off",
        "@stylistic/operator-linebreak": "off",
    },
})
