"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/widget/page",{

/***/ "(app-pages-browser)/./src/lib/supabase.ts":
/*!*****************************!*\
  !*** ./src/lib/supabase.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getWidgetSettings: () => (/* binding */ getWidgetSettings),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   updateWidgetSettings: () => (/* binding */ updateWidgetSettings)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(app-pages-browser)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://moayozcwypbsmnnbtkdv.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vYXlvemN3eXBic21ubmJ0a2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTQ1OTIsImV4cCI6MjA1MjE5MDU5Mn0.aiV5-q7F-5z-CIs8pVsTotAsyziGyP5tVpaydYgYZs8\";\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error('Missing Supabase environment variables');\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n    auth: {\n        persistSession: true,\n        autoRefreshToken: true\n    }\n});\nasync function updateWidgetSettings(widgetId, settings) {\n    const { data, error } = await supabase.from('widgets').update({\n        settings\n    }).eq('id', widgetId).select().single();\n    if (error) throw error;\n    return data;\n}\nasync function getWidgetSettings(widgetId) {\n    const { data, error } = await supabase.from('widgets').select('settings').eq('id', widgetId).single();\n    if (error) throw error;\n    return data.settings;\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFxRDtBQUVyRCxNQUFNQyxjQUFjQywwQ0FBb0M7QUFDeEQsTUFBTUcsa0JBQWtCSCxrTkFBeUM7QUFFakUsSUFBSSxDQUFDRCxlQUFlLENBQUNJLGlCQUFpQjtJQUNwQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFTyxNQUFNQyxXQUFXUixtRUFBWUEsQ0FBQ0MsYUFBYUksaUJBQWlCO0lBQ2pFSSxNQUFNO1FBQ0pDLGdCQUFnQjtRQUNoQkMsa0JBQWtCO0lBQ3BCO0FBQ0YsR0FBRztBQWVJLGVBQWVDLHFCQUFxQkMsUUFBZ0IsRUFBRUMsUUFBd0I7SUFDbkYsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1SLFNBQzNCUyxJQUFJLENBQUMsV0FDTEMsTUFBTSxDQUFDO1FBQUVKO0lBQVMsR0FDbEJLLEVBQUUsQ0FBQyxNQUFNTixVQUNUTyxNQUFNLEdBQ05DLE1BQU07SUFFVCxJQUFJTCxPQUFPLE1BQU1BO0lBQ2pCLE9BQU9EO0FBQ1Q7QUFFTyxlQUFlTyxrQkFBa0JULFFBQWdCO0lBQ3RELE1BQU0sRUFBRUUsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNUixTQUMzQlMsSUFBSSxDQUFDLFdBQ0xHLE1BQU0sQ0FBQyxZQUNQRCxFQUFFLENBQUMsTUFBTU4sVUFDVFEsTUFBTTtJQUVULElBQUlMLE9BQU8sTUFBTUE7SUFDakIsT0FBT0QsS0FBS0QsUUFBUTtBQUN0QiIsInNvdXJjZXMiOlsiL1VzZXJzL21lenJpL0Rlc2t0b3AvSGVob1N0b3J5L3NyYy9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcblxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWTtcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBTdXBhYmFzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZUFub25LZXksIHtcbiAgYXV0aDoge1xuICAgIHBlcnNpc3RTZXNzaW9uOiB0cnVlLFxuICAgIGF1dG9SZWZyZXNoVG9rZW46IHRydWUsXG4gIH0sXG59KTtcblxuZXhwb3J0IHR5cGUgU3RvcnkgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBhdXRob3JfaWQ6IHN0cmluZztcbiAgcHVibGlzaGVkOiBib29sZWFuO1xuICB0aHVtYm5haWw6IHN0cmluZztcbiAgcHJvZmlsZV9pbWFnZT86IHN0cmluZztcbiAgcHJvZmlsZV9uYW1lPzogc3RyaW5nO1xuICB0YWdzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlV2lkZ2V0U2V0dGluZ3Mod2lkZ2V0SWQ6IHN0cmluZywgc2V0dGluZ3M6IFdpZGdldFNldHRpbmdzKSB7XG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oJ3dpZGdldHMnKVxuICAgIC51cGRhdGUoeyBzZXR0aW5ncyB9KVxuICAgIC5lcSgnaWQnLCB3aWRnZXRJZClcbiAgICAuc2VsZWN0KClcbiAgICAuc2luZ2xlKCk7XG5cbiAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgcmV0dXJuIGRhdGE7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXaWRnZXRTZXR0aW5ncyh3aWRnZXRJZDogc3RyaW5nKTogUHJvbWlzZTxXaWRnZXRTZXR0aW5ncz4ge1xuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgIC5mcm9tKCd3aWRnZXRzJylcbiAgICAuc2VsZWN0KCdzZXR0aW5ncycpXG4gICAgLmVxKCdpZCcsIHdpZGdldElkKVxuICAgIC5zaW5nbGUoKTtcblxuICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuICByZXR1cm4gZGF0YS5zZXR0aW5ncztcbn0gIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiRXJyb3IiLCJzdXBhYmFzZSIsImF1dGgiLCJwZXJzaXN0U2Vzc2lvbiIsImF1dG9SZWZyZXNoVG9rZW4iLCJ1cGRhdGVXaWRnZXRTZXR0aW5ncyIsIndpZGdldElkIiwic2V0dGluZ3MiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwidXBkYXRlIiwiZXEiLCJzZWxlY3QiLCJzaW5nbGUiLCJnZXRXaWRnZXRTZXR0aW5ncyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/lib/supabase.ts\n"));

/***/ })

});