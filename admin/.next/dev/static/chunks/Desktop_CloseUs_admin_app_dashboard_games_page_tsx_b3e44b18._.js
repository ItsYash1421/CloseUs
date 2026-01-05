(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GamesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CloseUs/admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CloseUs/admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CloseUs/admin/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CloseUs/admin/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function GamesPage() {
    _s();
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Category form
    const [showCategoryForm, setShowCategoryForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [categoryForm, setCategoryForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        gameType: 'never_have_i_ever',
        name: '',
        emoji: '',
        tags: '',
        color: '#fef3c7',
        isTrending: false
    });
    // Question form
    const [showQuestionForm, setShowQuestionForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [questionForm, setQuestionForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        categoryId: '',
        text: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamesPage.useEffect": ()=>{
            if (token) {
                fetchCategories();
            }
        }
    }["GamesPage.useEffect"], [
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamesPage.useEffect": ()=>{
            if (selectedCategory && token) {
                fetchQuestions(selectedCategory);
            }
        }
    }["GamesPage.useEffect"], [
        selectedCategory,
        token
    ]);
    const fetchCategories = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/admin/games/categories?gameType=never_have_i_ever', token);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };
    const fetchQuestions = async (categoryId)=>{
        setLoading(true);
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/admin/games/questions/category/${categoryId}`, token);
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally{
            setLoading(false);
        }
    };
    const handleCreateCategory = async (e)=>{
        e.preventDefault();
        try {
            const tagsArray = categoryForm.tags.split(',').map((t)=>t.trim()).filter(Boolean);
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/admin/games/categories', {
                ...categoryForm,
                tags: tagsArray
            }, token);
            setShowCategoryForm(false);
            setCategoryForm({
                gameType: 'never_have_i_ever',
                name: '',
                emoji: '',
                tags: '',
                color: '#fef3c7',
                isTrending: false
            });
            fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };
    const handleCreateQuestion = async (e)=>{
        e.preventDefault();
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/admin/games/questions', questionForm, token);
            setShowQuestionForm(false);
            setQuestionForm({
                categoryId: '',
                text: ''
            });
            if (selectedCategory) {
                fetchQuestions(selectedCategory);
            }
        } catch (error) {
            console.error('Failed to create question:', error);
        }
    };
    const handleDeleteCategory = async (id)=>{
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`/admin/games/categories/${id}`, token);
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Failed to delete category');
        }
    };
    const handleDeleteQuestion = async (id)=>{
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`/admin/games/questions/${id}`, token);
            if (selectedCategory) {
                fetchQuestions(selectedCategory);
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };
    const toggleTrending = async (id, currentStatus)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].put(`/admin/games/categories/${id}`, {
                isTrending: !currentStatus
            }, token);
            fetchCategories();
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-gray-900",
                    children: "Games Management"
                }, void 0, false, {
                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                    lineNumber: 140,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                lineNumber: 139,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowCategoryForm(!showCategoryForm),
                    className: "btn-primary",
                    children: "+ Create Game Category"
                }, void 0, false, {
                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                    lineNumber: 144,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                lineNumber: 143,
                columnNumber: 13
            }, this),
            showCategoryForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "New Game Category"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 152,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleCreateCategory,
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Game Type"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: categoryForm.gameType,
                                        onChange: (e)=>setCategoryForm({
                                                ...categoryForm,
                                                gameType: e.target.value
                                            }),
                                        className: "input",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "never_have_i_ever",
                                                children: "Never Have I Ever"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 161,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "would_you_rather",
                                                children: "Would You Rather"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "who_more_likely",
                                                children: "Who's More Likely To"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 154,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: categoryForm.name,
                                        onChange: (e)=>setCategoryForm({
                                                ...categoryForm,
                                                name: e.target.value
                                            }),
                                        className: "input",
                                        placeholder: "Travel F*ckups & Brags",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 166,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Emoji"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: categoryForm.emoji,
                                                onChange: (e)=>setCategoryForm({
                                                        ...categoryForm,
                                                        emoji: e.target.value
                                                    }),
                                                className: "input",
                                                placeholder: "🧳"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 180,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Color"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 189,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "color",
                                                value: categoryForm.color,
                                                onChange: (e)=>setCategoryForm({
                                                        ...categoryForm,
                                                        color: e.target.value
                                                    }),
                                                className: "input h-10"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 177,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Tags (comma separated)"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: categoryForm.tags,
                                        onChange: (e)=>setCategoryForm({
                                                ...categoryForm,
                                                tags: e.target.value
                                            }),
                                        className: "input",
                                        placeholder: "#TravelOops, #Should'veStayedHome"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 198,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "isTrending",
                                        checked: categoryForm.isTrending,
                                        onChange: (e)=>setCategoryForm({
                                                ...categoryForm,
                                                isTrending: e.target.checked
                                            }),
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 209,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "isTrending",
                                        className: "text-sm font-medium",
                                        children: "Mark as Trending"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 208,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "btn-primary",
                                        children: "Create"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 221,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowCategoryForm(false),
                                        className: "btn-secondary",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 220,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 153,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                lineNumber: 151,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            backgroundColor: category.color + '40'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: category.emoji
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-lg",
                                                        children: category.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1",
                                                        children: category.tags?.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-blue-600",
                                                                children: tag
                                                            }, idx, false, {
                                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 45
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 mt-1",
                                                        children: [
                                                            category.questionCount,
                                                            " questions • ",
                                                            category.timesPlayed,
                                                            " plays"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            category.isTrending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "badge bg-red-100 text-red-800",
                                                children: "📈 Trending"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 255,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleTrending(category._id, category.isTrending),
                                                className: "text-blue-600 hover:text-blue-700",
                                                title: "Toggle trending",
                                                children: "⭐"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDeleteCategory(category._id),
                                                className: "text-red-600 hover:text-red-700",
                                                children: "🗑️"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                lineNumber: 264,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 238,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory(category._id),
                                className: "btn-secondary w-full mt-2",
                                children: "Manage Questions"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 272,
                                columnNumber: 25
                            }, this)
                        ]
                    }, category._id, true, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 233,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                lineNumber: 231,
                columnNumber: 13
            }, this),
            selectedCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold",
                                children: [
                                    "Questions for",
                                    ' ',
                                    categories.find((c)=>c._id === selectedCategory)?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 286,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowQuestionForm(!showQuestionForm),
                                        className: "btn-primary",
                                        children: "+ Add Question"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedCategory(''),
                                        className: "btn-secondary",
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                        lineNumber: 297,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 290,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 285,
                        columnNumber: 21
                    }, this),
                    showQuestionForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 p-4 bg-gray-50 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleCreateQuestion,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Question Text"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 308,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: questionForm.text,
                                            onChange: (e)=>setQuestionForm({
                                                    ...questionForm,
                                                    text: e.target.value
                                                }),
                                            className: "input",
                                            rows: 2,
                                            placeholder: "Never have I ever...",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 309,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            onClick: ()=>setQuestionForm({
                                                    ...questionForm,
                                                    categoryId: selectedCategory
                                                }),
                                            className: "btn-primary",
                                            children: "Add"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 319,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowQuestionForm(false),
                                            className: "btn-secondary",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 326,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                    lineNumber: 318,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                            lineNumber: 306,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 305,
                        columnNumber: 25
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                            lineNumber: 337,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 336,
                        columnNumber: 25
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            questions.map((question, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center p-3 bg-white rounded border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium mr-2",
                                                    children: [
                                                        idx + 1,
                                                        "."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 41
                                                }, this),
                                                question.text,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500 ml-2",
                                                    children: [
                                                        "(Played ",
                                                        question.timesPlayed || 0,
                                                        " times)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 343,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleDeleteQuestion(question._id),
                                            className: "text-red-600 hover:text-red-700 ml-4",
                                            children: "🗑️"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                            lineNumber: 350,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, question._id, true, {
                                    fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                    lineNumber: 342,
                                    columnNumber: 33
                                }, this)),
                            questions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-gray-500 py-8",
                                children: "No questions yet. Add some!"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                                lineNumber: 359,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                        lineNumber: 340,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
                lineNumber: 284,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/CloseUs/admin/app/dashboard/games/page.tsx",
        lineNumber: 138,
        columnNumber: 9
    }, this);
}
_s(GamesPage, "bvC99IVxPHDl2qIfFTOHp6tfCUo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CloseUs$2f$admin$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = GamesPage;
var _c;
__turbopack_context__.k.register(_c, "GamesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_CloseUs_admin_app_dashboard_games_page_tsx_b3e44b18._.js.map