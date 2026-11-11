// vp migrate: merged .oxlintrc.json (22c9e5c4fb2530def4d98a25bbea732b).

import { fileURLToPath } from 'node:url'
import stylistic from '@stylistic/eslint-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import globals from 'globals'
import { defineConfig, lazyPlugins } from 'vite-plus'
import type { OxlintConfig } from 'vite-plus/lint'

const browserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(
    ([name, writable]): [string, 'readonly' | 'writable'] => [
      name,
      writable ? 'writable' : 'readonly'
    ]
  )
)

const scriptFiles = ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}']

const sourceInputs = [
  'src/**',
  'tests/**',
  'scripts/**',
  'public/**',
  '*.{ts,tsx,js,jsx,mjs,cjs,mts,cts,json,html}',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml'
]

const formatIgnorePatterns = [
  'build',
  'coverage',
  '.playwright-results/**',
  'playwright-report/**',
  '.playwright-report/**',
  '.impeccable/**',
  'node_modules',
  'dist',
  '*.html',
  '.next/**',
  '.stitch/**',
  '.playwright-mcp/**',
  'next-env.d.ts',
  '.agents/**',
  '.claude/**',
  '.aiassistant/**',
  '.continue/**',
  '.junie/**',
  'src/components/ui/**',
  'src/lib/**',
  'public/**',
  'src/assets/tattoo-video-manifest.json'
]

// Stylistic owns JS/TS whitespace, including StandardJS's `function name ()`.
// Oxfmt owns other formats, so the two tools never rewrite the same files.
const standardTsStyle = {
  ...stylistic.configs.customize({
    pluginName: 'stylistic',
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
    arrowParens: false,
    braceStyle: '1tbs',
    quoteProps: 'as-needed',
    commaDangle: 'never'
  }).rules,
  'stylistic/space-before-function-paren': ['error', 'always'],
  'stylistic/function-call-spacing': ['error', 'never'],
  'stylistic/generator-star-spacing': ['error', { before: true, after: true }],
  'stylistic/yield-star-spacing': ['error', 'both'],
  'stylistic/operator-linebreak': [
    'error',
    'after',
    { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }
  ],
  'stylistic/object-curly-newline': [
    'error',
    { multiline: true, consistent: true }
  ],
  'stylistic/object-property-newline': [
    'error',
    { allowAllPropertiesOnSameLine: true }
  ],
  'stylistic/linebreak-style': [
    'error',
    process.platform === 'win32' ? 'windows' : 'unix'
  ],
  'stylistic/arrow-parens': ['error', 'as-needed'],
  'stylistic/quotes': ['error', 'single', { avoidEscape: true }],
  'stylistic/jsx-quotes': ['error', 'prefer-double'],
  // Keep JSX text and inline expressions together to preserve rendered spaces.
  'stylistic/jsx-one-expression-per-line': 'off'
} satisfies NonNullable<OxlintConfig['rules']>

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: [
        /(^|[\\/])\.playwright-(results|report)([\\/]|$)/,
        '**/.local-media/**',
        '**/.local-tools/**',
        '**/.playwright-results/**',
        '**/.playwright-report/**',
        '**/.prepare-ink-views-*',
        '**/.prepare-ink-views-*/**'
      ]
    }
  },
  test: {
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/e2e/**']
  },
  staged: {
    '!{.agents,.claude,.aiassistant,.continue,.junie,.stitch}/**': 'vp check --fix'
  },
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn'],
    categories: {
      correctness: 'warn'
    },
    options: {
      typeAware: true,
      typeCheck: true
    },
    env: {
      builtin: true
    },
    ignorePatterns: [
      'dist',
      'node_modules',
      '*.config.js',
      '.agents/**',
      '.claude/**',
      '.aiassistant/**'
    ],
    overrides: [
      {
        files: ['**/*.{js,mjs,cjs}'],
        rules: {
          'constructor-super': 'error',
          'for-direction': 'error',
          'getter-return': 'error',
          'no-async-promise-executor': 'error',
          'no-case-declarations': 'error',
          'no-class-assign': 'error',
          'no-compare-neg-zero': 'error',
          'no-cond-assign': 'error',
          'no-const-assign': 'error',
          'no-constant-binary-expression': 'error',
          'no-constant-condition': 'error',
          'no-control-regex': 'error',
          'no-debugger': 'error',
          'no-delete-var': 'error',
          'no-dupe-class-members': 'error',
          'no-dupe-else-if': 'error',
          'no-dupe-keys': 'error',
          'no-duplicate-case': 'error',
          'no-empty': 'error',
          'no-empty-character-class': 'error',
          'no-empty-pattern': 'error',
          'no-empty-static-block': 'error',
          'no-ex-assign': 'error',
          'no-extra-boolean-cast': 'error',
          'no-fallthrough': 'error',
          'no-func-assign': 'error',
          'no-global-assign': 'error',
          'no-import-assign': 'error',
          'no-invalid-regexp': 'error',
          'no-irregular-whitespace': 'error',
          'no-loss-of-precision': 'error',
          'no-misleading-character-class': 'error',
          'no-new-native-nonconstructor': 'error',
          'no-nonoctal-decimal-escape': 'error',
          'no-obj-calls': 'error',
          'no-prototype-builtins': 'error',
          'no-redeclare': 'error',
          'no-regex-spaces': 'error',
          'no-self-assign': 'error',
          'no-setter-return': 'error',
          'no-shadow-restricted-names': 'error',
          'no-sparse-arrays': 'error',
          'no-this-before-super': 'error',
          'no-undef': 'error',
          'no-unexpected-multiline': 'error',
          'no-unreachable': 'error',
          'no-unsafe-finally': 'error',
          'no-unsafe-negation': 'error',
          'no-unsafe-optional-chaining': 'error',
          'no-unused-labels': 'error',
          'no-unused-private-class-members': 'error',
          'no-unused-vars': 'error',
          'no-useless-backreference': 'error',
          'no-useless-catch': 'error',
          'no-useless-escape': 'error',
          'no-with': 'error',
          'require-yield': 'error',
          'use-isnan': 'error',
          'valid-typeof': 'error'
        },
        env: {
          es2022: true
        },
        globals: browserGlobals
      },
      {
        files: ['**/*.{ts,tsx}'],
        rules: {
          'constructor-super': ['error'],
          'for-direction': ['error'],
          'getter-return': 'off',
          'no-async-promise-executor': ['error'],
          'no-case-declarations': ['error'],
          'no-class-assign': ['error'],
          'no-compare-neg-zero': ['error'],
          'no-cond-assign': ['error'],
          'no-const-assign': ['error'],
          'no-constant-binary-expression': ['error'],
          'no-constant-condition': [
            'error',
            {
              checkLoops: false
            }
          ],
          'no-control-regex': ['error'],
          'no-debugger': ['error'],
          'no-delete-var': ['error'],
          'no-dupe-class-members': ['error'],
          'no-dupe-else-if': ['error'],
          'no-dupe-keys': ['error'],
          'no-duplicate-case': ['error'],
          'no-empty': [
            'error',
            {
              allowEmptyCatch: true
            }
          ],
          'no-empty-character-class': ['error'],
          'no-empty-pattern': ['error'],
          'no-empty-static-block': ['error'],
          'no-ex-assign': ['error'],
          'no-extra-boolean-cast': ['error'],
          'no-fallthrough': ['error'],
          'no-func-assign': ['error'],
          'no-global-assign': ['error'],
          'no-import-assign': ['error'],
          'no-invalid-regexp': ['error'],
          'no-irregular-whitespace': ['error'],
          'no-loss-of-precision': ['error'],
          'no-misleading-character-class': ['error'],
          'no-new-native-nonconstructor': ['error'],
          'no-nonoctal-decimal-escape': 'error',
          'no-obj-calls': ['error'],
          'no-prototype-builtins': ['error'],
          'no-redeclare': 'off',
          'no-regex-spaces': ['error'],
          'no-self-assign': [
            'error',
            {
              props: true
            }
          ],
          'no-setter-return': 'off',
          'no-shadow-restricted-names': ['error'],
          'no-sparse-arrays': ['error'],
          'no-this-before-super': ['error'],
          'no-undef': 'off',
          'no-unexpected-multiline': 'off',
          'no-unreachable': ['error'],
          'no-unsafe-finally': ['error'],
          'no-unsafe-negation': ['error'],
          'no-unsafe-optional-chaining': 'error',
          'no-unused-labels': 'error',
          'no-unused-private-class-members': 'error',
          'no-unused-vars': [
            'error',
            {
              args: 'none',
              caughtErrors: 'none',
              ignoreRestSiblings: true,
              vars: 'all'
            }
          ],
          'no-useless-backreference': ['error'],
          'no-useless-catch': ['error'],
          'no-useless-escape': ['error'],
          'no-with': ['error'],
          'require-yield': 'error',
          'use-isnan': [
            'error',
            {
              enforceForSwitchCase: true,
              enforceForIndexOf: true
            }
          ],
          'valid-typeof': [
            'error',
            {
              requireStringLiterals: true
            }
          ],
          'no-var': ['error'],
          'prefer-const': [
            'error',
            {
              destructuring: 'all',
              ignoreReadBeforeAssign: false
            }
          ],
          'prefer-rest-params': 'error',
          'prefer-spread': ['error'],
          'no-array-constructor': ['error'],
          'no-unused-expressions': [
            'error',
            {
              allowShortCircuit: true,
              allowTernary: true,
              allowTaggedTemplates: true,
              enforceForJSX: false
            }
          ],
          'typescript/ban-ts-comment': [
            'error',
            {
              'ts-expect-error': 'allow-with-description',
              'ts-ignore': true,
              'ts-nocheck': true,
              'ts-check': false,
              minimumDescriptionLength: 3
            }
          ],
          'typescript/no-duplicate-enum-values': ['error'],
          'typescript/no-empty-object-type': [
            'error',
            {
              allowInterfaces: 'with-single-extends',
              allowObjectTypes: 'never'
            }
          ],
          'typescript/no-explicit-any': [
            'error',
            {
              fixToUnknown: false,
              ignoreRestArgs: false
            }
          ],
          'typescript/no-extra-non-null-assertion': ['error'],
          'typescript/no-misused-new': ['error'],
          'typescript/no-namespace': ['error'],
          'typescript/no-non-null-asserted-optional-chain': ['error'],
          'typescript/no-require-imports': [
            'error',
            {
              allow: [],
              allowAsImport: false
            }
          ],
          'typescript/no-this-alias': [
            'error',
            {
              allowDestructuring: true
            }
          ],
          'typescript/no-unnecessary-type-constraint': ['error'],
          'typescript/no-unsafe-declaration-merging': ['error'],
          'typescript/no-unsafe-function-type': ['error'],
          'typescript/no-wrapper-object-types': ['error'],
          'typescript/prefer-as-const': ['error'],
          'typescript/prefer-namespace-keyword': ['error'],
          'typescript/triple-slash-reference': 'off',
          'accessor-pairs': [
            'error',
            {
              setWithoutGet: true,
              getWithoutSet: false,
              enforceForClassMembers: true
            }
          ],
          'array-callback-return': [
            'error',
            {
              allowImplicit: false,
              allowVoid: false,
              checkForEach: false
            }
          ],
          'arrow-body-style': [
            'error',
            'as-needed',
            {
              requireReturnForObjectLiteral: false
            }
          ],
          complexity: [
            'error',
            {
              variant: 'modified',
              max: 10
            }
          ],
          curly: 'off',
          'default-case-last': ['error'],
          eqeqeq: [
            'error',
            'always',
            {
              null: 'ignore'
            }
          ],
          'grouped-accessor-pairs': ['error', 'getBeforeSet'],
          'guard-for-in': ['error'],
          'logical-assignment-operators': [
            'error',
            'always',
            {
              enforceForIfStatements: true
            }
          ],
          'max-depth': [
            'error',
            {
              max: 5
            }
          ],
          'max-lines': [
            'error',
            {
              max: 450,
              skipBlankLines: true,
              skipComments: true
            }
          ],
          'max-nested-callbacks': [
            'error',
            {
              max: 3
            }
          ],
          'new-cap': [
            'error',
            {
              newIsCap: true,
              capIsNew: false,
              properties: true
            }
          ],
          'no-alert': ['error'],
          'no-caller': ['error'],
          'no-console': ['error'],
          'no-constructor-return': ['error'],
          'no-eval': ['error'],
          'no-extend-native': ['error'],
          'no-extra-bind': ['error'],
          'no-implicit-globals': ['error'],
          'no-iterator': ['error'],
          'no-labels': [
            'error',
            {
              allowLoop: false,
              allowSwitch: false
            }
          ],
          'no-lone-blocks': ['error'],
          'no-multi-str': ['error'],
          'no-new': ['error'],
          'no-new-func': ['error'],
          'no-new-wrappers': ['error'],
          'no-object-constructor': ['error'],
          'no-proto': ['error'],
          'no-return-assign': ['error', 'except-parens'],
          'no-script-url': ['error'],
          'no-self-compare': ['error'],
          'no-sequences': ['error'],
          'no-template-curly-in-string': ['error'],
          'no-unmodified-loop-condition': ['error'],
          'no-unneeded-ternary': [
            'error',
            {
              defaultAssignment: false
            }
          ],
          'no-unreachable-loop': ['error'],
          'no-useless-call': ['error'],
          'no-useless-computed-key': ['error'],
          'no-useless-rename': ['error'],
          'no-useless-return': ['error'],
          'no-void': [
            'error',
            {
              allowAsStatement: true
            }
          ],
          'object-shorthand': ['warn', 'properties'],
          'one-var': [
            'error',
            {
              initialized: 'never'
            }
          ],
          'prefer-regex-literals': [
            'error',
            {
              disallowRedundantWrapping: true
            }
          ],
          'preserve-caught-error': [
            'error',
            {
              requireCatchParameter: true
            }
          ],
          'symbol-description': ['error'],
          'unicode-bom': ['error', 'never'],
          yoda: ['error', 'never'],
          'promise/avoid-new': ['error'],
          'promise/param-names': ['error'],
          'import/export': ['error'],
          'import/first': ['error'],
          'import/no-absolute-path': 'off',
          'import/no-duplicates': ['error'],
          'import/no-named-default': ['error'],
          'import/no-webpack-loader-syntax': ['error'],
          'class-methods-use-this': [
            'error',
            {
              exceptMethods: [],
              enforceForClassFields: true,
              ignoreOverrideMethods: false,
              ignoreClassesThatImplementAnInterface: false
            }
          ],
          'init-declarations': ['error', 'always'],
          'max-params': [
            'error',
            {
              max: 4
            }
          ],
          'no-empty-function': [
            'error',
            {
              allow: []
            }
          ],
          'no-loop-func': ['error'],
          'no-magic-numbers': 'off',
          'no-use-before-define': [
            'error',
            {
              functions: false,
              classes: false,
              enums: false,
              variables: false,
              typedefs: false
            }
          ],
          'no-useless-constructor': ['error'],
          'node/handle-callback-err': ['error', '^(err|error)$'],
          'node/no-exports-assign': ['error'],
          'node/no-new-require': ['error'],
          'node/no-path-concat': ['error'],
          'typescript/adjacent-overload-signatures': ['error'],
          'typescript/array-type': [
            'error',
            {
              default: 'array-simple'
            }
          ],
          'typescript/await-thenable': ['error'],
          'typescript/ban-tslint-comment': ['error'],
          'typescript/class-literal-property-style': ['error', 'fields'],
          'typescript/consistent-generic-constructors': [
            'error',
            'constructor'
          ],
          'typescript/consistent-indexed-object-style': ['error', 'record'],
          'typescript/consistent-type-assertions': [
            'error',
            {
              assertionStyle: 'as',
              objectLiteralTypeAssertions: 'never'
            }
          ],
          'typescript/consistent-type-definitions': ['error', 'type'],
          'typescript/consistent-type-exports': [
            'error',
            {
              fixMixedExportsWithInlineTypeSpecifier: true
            }
          ],
          'typescript/consistent-type-imports': [
            'error',
            {
              prefer: 'type-imports',
              disallowTypeAnnotations: true,
              fixStyle: 'inline-type-imports'
            }
          ],
          'typescript/dot-notation': [
            'error',
            {
              allowIndexSignaturePropertyAccess: false,
              allowKeywords: true,
              allowPattern: '',
              allowPrivateClassPropertyAccess: false,
              allowProtectedClassPropertyAccess: false
            }
          ],
          'typescript/explicit-function-return-type': 'off',
          'typescript/method-signature-style': ['error'],
          'typescript/no-array-delete': ['error'],
          'typescript/no-base-to-string': ['error'],
          'typescript/no-confusing-non-null-assertion': ['error'],
          'typescript/no-confusing-void-expression': 'off',
          'typescript/no-deprecated': ['warn'],
          'typescript/no-duplicate-type-constituents': [
            'error',
            {
              ignoreIntersections: false,
              ignoreUnions: false
            }
          ],
          'typescript/no-dynamic-delete': ['error'],
          'typescript/no-extraneous-class': [
            'error',
            {
              allowWithDecorator: true
            }
          ],
          'typescript/no-floating-promises': ['error'],
          'typescript/no-for-in-array': ['error'],
          'typescript/no-implied-eval': ['error'],
          'typescript/no-import-type-side-effects': ['error'],
          'typescript/no-inferrable-types': [
            'error',
            {
              ignoreParameters: false,
              ignoreProperties: false
            }
          ],
          'typescript/no-invalid-void-type': ['error'],
          'typescript/no-meaningless-void-operator': [
            'error',
            {
              checkNever: true
            }
          ],
          'typescript/no-misused-promises': ['error'],
          'typescript/no-misused-spread': [
            'error',
            {
              allow: []
            }
          ],
          'typescript/no-mixed-enums': ['error'],
          'typescript/no-non-null-asserted-nullish-coalescing': ['error'],
          'typescript/no-non-null-assertion': 'warn',
          'typescript/no-redundant-type-constituents': ['error'],
          'typescript/no-unnecessary-boolean-literal-compare': ['error'],
          'typescript/no-unnecessary-condition': [
            'error',
            {
              allowConstantLoopConditions: true
            }
          ],
          'typescript/no-unnecessary-parameter-property-assignment': ['error'],
          'typescript/no-unnecessary-qualifier': ['error'],
          'typescript/no-unnecessary-template-expression': ['error'],
          'typescript/no-unnecessary-type-arguments': ['error'],
          'typescript/no-unnecessary-type-assertion': ['error'],
          'typescript/no-unnecessary-type-conversion': ['error'],
          'typescript/no-unnecessary-type-parameters': ['error'],
          'typescript/no-unsafe-argument': ['error'],
          'typescript/no-unsafe-assignment': ['error'],
          'typescript/no-unsafe-call': ['error'],
          'typescript/no-unsafe-enum-comparison': ['error'],
          'typescript/no-unsafe-member-access': ['error'],
          'typescript/no-unsafe-return': ['error'],
          'typescript/no-unsafe-type-assertion': ['error'],
          'typescript/no-unsafe-unary-minus': ['error'],
          'typescript/no-useless-empty-export': ['error'],
          'typescript/non-nullable-type-assertion-style': ['error'],
          'typescript/only-throw-error': [
            'error',
            {
              allowThrowingAny: false,
              allowThrowingUnknown: false
            }
          ],
          'typescript/prefer-find': ['error'],
          'typescript/prefer-for-of': ['error'],
          'typescript/prefer-function-type': ['error'],
          'typescript/prefer-includes': ['error'],
          'typescript/prefer-literal-enum-member': [
            'error',
            {
              allowBitwiseExpressions: true
            }
          ],
          'typescript/prefer-nullish-coalescing': 'off',
          'typescript/prefer-optional-chain': ['error'],
          'typescript/prefer-promise-reject-errors': ['error'],
          'typescript/prefer-readonly': ['error'],
          'typescript/prefer-reduce-type-parameter': ['error'],
          'typescript/prefer-regexp-exec': ['error'],
          'typescript/prefer-return-this-type': ['error'],
          'typescript/prefer-string-starts-ends-with': [
            'error',
            {
              allowSingleElementEquality: 'never'
            }
          ],
          'typescript/promise-function-async': ['error'],
          'typescript/related-getter-setter-pairs': ['error'],
          'typescript/require-array-sort-compare': [
            'error',
            {
              ignoreStringArrays: true
            }
          ],
          'typescript/require-await': ['error'],
          'typescript/restrict-plus-operands': [
            'error',
            {
              skipCompoundAssignments: false
            }
          ],
          'typescript/restrict-template-expressions': [
            'error',
            {
              allowNumber: true
            }
          ],
          'typescript/return-await': ['error', 'always'],
          'typescript/strict-boolean-expressions': 'off',
          'typescript/switch-exhaustiveness-check': [
            'error',
            {
              allowDefaultCaseForExhaustiveSwitch: false,
              requireDefaultForNonUnion: false,
              considerDefaultExhaustiveForUnions: true
            }
          ],
          'typescript/unbound-method': [
            'error',
            {
              ignoreStatic: false
            }
          ],
          'typescript/unified-signatures': [
            'error',
            {
              ignoreDifferentlyNamedParameters: false
            }
          ],
          'typescript/use-unknown-in-catch-callback-variable': ['error'],
          'unicorn/empty-brace-spaces': 'off',
          'unicorn/no-nested-ternary': 'off',
          'unicorn/number-literal-case': 'off',
          'react/rules-of-hooks': 'error',
          'react/exhaustive-deps': 'warn',
          'react/only-export-components': [
            'warn',
            {
              allowConstantExport: true
            }
          ]
        },
        plugins: ['node', 'promise', 'import', 'react'],
        jsPlugins: [],
        env: {
          es2022: true
        },
        globals: browserGlobals
      },
      {
        files: ['vite.config.ts'],
        rules: { 'max-lines': 'off' }
      },
      {
        files: scriptFiles,
        excludeFiles: formatIgnorePatterns,
        jsPlugins: [
          { name: 'stylistic', specifier: '@stylistic/eslint-plugin' }
        ],
        rules: standardTsStyle
      }
    ],
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin'
      }
    ],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error'
    }
  },
  fmt: {
    singleQuote: false,
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    bracketSpacing: true,
    endOfLine: process.platform === 'win32' ? 'crlf' : 'lf',
    bracketSameLine: false,
    objectWrap: 'preserve',
    sortPackageJson: false,
    ignorePatterns: [...formatIgnorePatterns, ...scriptFiles],
    overrides: [
      {
        files: ['**/*.{json,jsonc,json5}'],
        options: {
          trailingComma: 'none'
        }
      }
    ]
  },
  plugins: lazyPlugins(() => [react({ compiler: true }), tailwindcss()]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  run: {
    tasks: {
      build: {
        command: 'tsc -b && vp build && vpx scripts/check-production-build.ts',
        cache: {
          input: sourceInputs,
          output: [{ auto: true }, '!node_modules/.tmp/**', '!.playwright-results/**', '!.playwright-report/**']
        }
      },
      check: {
        command: 'vp check --deny-warnings',
        cache: true
      },
      tsc: {
        command: 'tsc --build --noEmit',
        cache: {
          input: sourceInputs,
          output: [{ auto: true }, '!node_modules/.tmp/**', '!.playwright-results/**', '!.playwright-report/**']
        }
      },
      test: {
        command: 'vp test',
        cache: {
          input: sourceInputs,
          env: ['FFMPEG_PATH', 'FFPROBE_PATH']
        }
      },
      'test:e2e': {
        command: 'vpr build && playwright test',
        cache: {
          input: sourceInputs,
          env: ['CI'],
          // Playwright artifacts are disposable. Replaying the cached terminal
          // output is enough; restoring stale reports would only confuse runs.
          output: []
        }
      },
      lint: {
        command: 'vp lint . --report-unused-disable-directives --max-warnings 0',
        cache: { input: sourceInputs }
      },
      'lint:tailwind': {
        command: 'vpx tailwind-lint --config ./src/global.css "src/**/*.{ts,tsx}"',
        cache: { input: sourceInputs }
      }
    }
  }
})
