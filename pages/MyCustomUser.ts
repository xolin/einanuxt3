/* __placeholder__ */
interface MyCustomUser {
id: number;
login: string;
}
const user = useSanctumUser<MyCustomUser>();

async function login() {
const { login } = useSanctumAuth();
const userCredentials = {
email: 'jo@jo.com',
password: '123456',
};
try {
await login(userCredentials);
} catch (error) {
console.log(error);
if (error && error.response?.status === 422) {
console.log(error.response?._data.errors);
}
}
}
const __VLS_componentsOption = {};
let __VLS_name!: 'Lagin';
function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {};
__VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div;
__VLS_intrinsicElements.main; __VLS_intrinsicElements.main;
__VLS_intrinsicElements.section; __VLS_intrinsicElements.section;
__VLS_intrinsicElements.small; __VLS_intrinsicElements.small; __VLS_intrinsicElements.small; __VLS_intrinsicElements.small; __VLS_intrinsicElements.small; __VLS_intrinsicElements.small;
__VLS_intrinsicElements.form; __VLS_intrinsicElements.form;
__VLS_intrinsicElements.label; __VLS_intrinsicElements.label; __VLS_intrinsicElements.label; __VLS_intrinsicElements.label; __VLS_intrinsicElements.label; __VLS_intrinsicElements.label;
__VLS_intrinsicElements.input; __VLS_intrinsicElements.input; __VLS_intrinsicElements.input;
__VLS_intrinsicElements.span; __VLS_intrinsicElements.span; __VLS_intrinsicElements.span; __VLS_intrinsicElements.span; __VLS_intrinsicElements.span; __VLS_intrinsicElements.span;
__VLS_intrinsicElements.button; __VLS_intrinsicElements.button;
__VLS_intrinsicElements.a; __VLS_intrinsicElements.a; __VLS_intrinsicElements.a; __VLS_intrinsicElements.a;
{
const __VLS_0 = __VLS_intrinsicElements["div"];
const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
const __VLS_2 = __VLS_1({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_0, typeof __VLS_2> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>;
{
const __VLS_5 = __VLS_intrinsicElements["main"];
const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
const __VLS_7 = __VLS_6({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_5, typeof __VLS_7> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7)!;
let __VLS_9!: __VLS_NormalizeEmits<typeof __VLS_8.emit>;
{
const __VLS_10 = __VLS_intrinsicElements["section"];
const __VLS_11 = __VLS_elementAsFunctionalComponent(__VLS_10);
const __VLS_12 = __VLS_11({ ...{}, class: ("absolute w-full h-full"), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_10, typeof __VLS_12> & Record<string, unknown>) => void)({ ...{}, class: ("absolute w-full h-full"), });
const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12)!;
let __VLS_14!: __VLS_NormalizeEmits<typeof __VLS_13.emit>;
{
const __VLS_15 = __VLS_intrinsicElements["div"];
const __VLS_16 = __VLS_elementAsFunctionalComponent(__VLS_15);
const __VLS_17 = __VLS_16({ ...{}, class: ("absolute top-0 w-full h-full bg-gray-900"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_16));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_15, typeof __VLS_17> & Record<string, unknown>) => void)({ ...{}, class: ("absolute top-0 w-full h-full bg-gray-900"), style: ({}), });
const __VLS_18 = __VLS_pickFunctionalComponentCtx(__VLS_15, __VLS_17)!;
let __VLS_19!: __VLS_NormalizeEmits<typeof __VLS_18.emit>;
}
{
const __VLS_20 = __VLS_intrinsicElements["div"];
const __VLS_21 = __VLS_elementAsFunctionalComponent(__VLS_20);
const __VLS_22 = __VLS_21({ ...{}, class: ("container mx-auto px-4 h-full"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_20, typeof __VLS_22> & Record<string, unknown>) => void)({ ...{}, class: ("container mx-auto px-4 h-full"), });
const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22)!;
let __VLS_24!: __VLS_NormalizeEmits<typeof __VLS_23.emit>;
{
const __VLS_25 = __VLS_intrinsicElements["div"];
const __VLS_26 = __VLS_elementAsFunctionalComponent(__VLS_25);
const __VLS_27 = __VLS_26({ ...{}, class: ("flex content-center items-center justify-center h-full"), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_25, typeof __VLS_27> & Record<string, unknown>) => void)({ ...{}, class: ("flex content-center items-center justify-center h-full"), });
const __VLS_28 = __VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27)!;
let __VLS_29!: __VLS_NormalizeEmits<typeof __VLS_28.emit>;
{
const __VLS_30 = __VLS_intrinsicElements["div"];
const __VLS_31 = __VLS_elementAsFunctionalComponent(__VLS_30);
const __VLS_32 = __VLS_31({ ...{}, class: ("w-full lg:w-4/12 px-4"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_30, typeof __VLS_32> & Record<string, unknown>) => void)({ ...{}, class: ("w-full lg:w-4/12 px-4"), });
const __VLS_33 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32)!;
let __VLS_34!: __VLS_NormalizeEmits<typeof __VLS_33.emit>;
{
const __VLS_35 = __VLS_intrinsicElements["div"];
const __VLS_36 = __VLS_elementAsFunctionalComponent(__VLS_35);
const __VLS_37 = __VLS_36({ ...{}, class: ("relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"), }, ...__VLS_functionalComponentArgsRest(__VLS_36));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_35, typeof __VLS_37> & Record<string, unknown>) => void)({ ...{}, class: ("relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"), });
const __VLS_38 = __VLS_pickFunctionalComponentCtx(__VLS_35, __VLS_37)!;
let __VLS_39!: __VLS_NormalizeEmits<typeof __VLS_38.emit>;
{
const __VLS_40 = __VLS_intrinsicElements["div"];
const __VLS_41 = __VLS_elementAsFunctionalComponent(__VLS_40);
const __VLS_42 = __VLS_41({ ...{}, class: ("rounded-t mb-0 px-6 py-6"), }, ...__VLS_functionalComponentArgsRest(__VLS_41));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_40, typeof __VLS_42> & Record<string, unknown>) => void)({ ...{}, class: ("rounded-t mb-0 px-6 py-6"), });
const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42)!;
let __VLS_44!: __VLS_NormalizeEmits<typeof __VLS_43.emit>;
}
{
const __VLS_45 = __VLS_intrinsicElements["div"];
const __VLS_46 = __VLS_elementAsFunctionalComponent(__VLS_45);
const __VLS_47 = __VLS_46({ ...{}, class: ("flex-auto px-4 lg:px-10 py-10 pt-0"), }, ...__VLS_functionalComponentArgsRest(__VLS_46));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_45, typeof __VLS_47> & Record<string, unknown>) => void)({ ...{}, class: ("flex-auto px-4 lg:px-10 py-10 pt-0"), });
const __VLS_48 = __VLS_pickFunctionalComponentCtx(__VLS_45, __VLS_47)!;
let __VLS_49!: __VLS_NormalizeEmits<typeof __VLS_48.emit>;
{
const __VLS_50 = __VLS_intrinsicElements["div"];
const __VLS_51 = __VLS_elementAsFunctionalComponent(__VLS_50);
const __VLS_52 = __VLS_51({ ...{}, class: ("text-gray-500 text-center mb-3 font-bold"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_50, typeof __VLS_52> & Record<string, unknown>) => void)({ ...{}, class: ("text-gray-500 text-center mb-3 font-bold"), });
const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52)!;
let __VLS_54!: __VLS_NormalizeEmits<typeof __VLS_53.emit>;
{
const __VLS_55 = __VLS_intrinsicElements["small"];
const __VLS_56 = __VLS_elementAsFunctionalComponent(__VLS_55);
const __VLS_57 = __VLS_56({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_56));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_55, typeof __VLS_57> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_58 = __VLS_pickFunctionalComponentCtx(__VLS_55, __VLS_57)!;
let __VLS_59!: __VLS_NormalizeEmits<typeof __VLS_58.emit>;
(__VLS_58.slots!).default;
}
(__VLS_53.slots!).default;
}
{
const __VLS_60 = __VLS_intrinsicElements["form"];
const __VLS_61 = __VLS_elementAsFunctionalComponent(__VLS_60);
const __VLS_62 = __VLS_61({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_61));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_60, typeof __VLS_62> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62)!;
let __VLS_64!: __VLS_NormalizeEmits<typeof __VLS_63.emit>;
{
const __VLS_65 = __VLS_intrinsicElements["div"];
const __VLS_66 = __VLS_elementAsFunctionalComponent(__VLS_65);
const __VLS_67 = __VLS_66({ ...{}, class: ("relative w-full mb-3"), }, ...__VLS_functionalComponentArgsRest(__VLS_66));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_65, typeof __VLS_67> & Record<string, unknown>) => void)({ ...{}, class: ("relative w-full mb-3"), });
const __VLS_68 = __VLS_pickFunctionalComponentCtx(__VLS_65, __VLS_67)!;
let __VLS_69!: __VLS_NormalizeEmits<typeof __VLS_68.emit>;
{
const __VLS_70 = __VLS_intrinsicElements["label"];
const __VLS_71 = __VLS_elementAsFunctionalComponent(__VLS_70);
const __VLS_72 = __VLS_71({ ...{}, class: ("block uppercase text-gray-700 text-xs font-bold mb-2"), for: ("grid-password"), }, ...__VLS_functionalComponentArgsRest(__VLS_71));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_70, typeof __VLS_72> & Record<string, unknown>) => void)({ ...{}, class: ("block uppercase text-gray-700 text-xs font-bold mb-2"), for: ("grid-password"), });
const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72)!;
let __VLS_74!: __VLS_NormalizeEmits<typeof __VLS_73.emit>;
(__VLS_73.slots!).default;
}
{
const __VLS_75 = __VLS_intrinsicElements["input"];
const __VLS_76 = __VLS_elementAsFunctionalComponent(__VLS_75);
const __VLS_77 = __VLS_76({ ...{}, type: ("email"), class: ("border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"), placeholder: ("Email"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_76));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_75, typeof __VLS_77> & Record<string, unknown>) => void)({ ...{}, type: ("email"), class: ("border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"), placeholder: ("Email"), style: ({}), });
const __VLS_78 = __VLS_pickFunctionalComponentCtx(__VLS_75, __VLS_77)!;
let __VLS_79!: __VLS_NormalizeEmits<typeof __VLS_78.emit>;
}
(__VLS_68.slots!).default;
}
{
const __VLS_80 = __VLS_intrinsicElements["div"];
const __VLS_81 = __VLS_elementAsFunctionalComponent(__VLS_80);
const __VLS_82 = __VLS_81({ ...{}, class: ("relative w-full mb-3"), }, ...__VLS_functionalComponentArgsRest(__VLS_81));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_80, typeof __VLS_82> & Record<string, unknown>) => void)({ ...{}, class: ("relative w-full mb-3"), });
const __VLS_83 = __VLS_pickFunctionalComponentCtx(__VLS_80, __VLS_82)!;
let __VLS_84!: __VLS_NormalizeEmits<typeof __VLS_83.emit>;
{
const __VLS_85 = __VLS_intrinsicElements["label"];
const __VLS_86 = __VLS_elementAsFunctionalComponent(__VLS_85);
const __VLS_87 = __VLS_86({ ...{}, class: ("block uppercase text-gray-700 text-xs font-bold mb-2"), for: ("grid-password"), }, ...__VLS_functionalComponentArgsRest(__VLS_86));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_85, typeof __VLS_87> & Record<string, unknown>) => void)({ ...{}, class: ("block uppercase text-gray-700 text-xs font-bold mb-2"), for: ("grid-password"), });
const __VLS_88 = __VLS_pickFunctionalComponentCtx(__VLS_85, __VLS_87)!;
let __VLS_89!: __VLS_NormalizeEmits<typeof __VLS_88.emit>;
(__VLS_88.slots!).default;
}
{
const __VLS_90 = __VLS_intrinsicElements["input"];
const __VLS_91 = __VLS_elementAsFunctionalComponent(__VLS_90);
const __VLS_92 = __VLS_91({ ...{}, type: ("password"), class: ("border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"), placeholder: ("Password"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_91));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_90, typeof __VLS_92> & Record<string, unknown>) => void)({ ...{}, type: ("password"), class: ("border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"), placeholder: ("Password"), style: ({}), });
const __VLS_93 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92)!;
let __VLS_94!: __VLS_NormalizeEmits<typeof __VLS_93.emit>;
}
(__VLS_83.slots!).default;
}
{
const __VLS_95 = __VLS_intrinsicElements["div"];
const __VLS_96 = __VLS_elementAsFunctionalComponent(__VLS_95);
const __VLS_97 = __VLS_96({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_96));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_95, typeof __VLS_97> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_98 = __VLS_pickFunctionalComponentCtx(__VLS_95, __VLS_97)!;
let __VLS_99!: __VLS_NormalizeEmits<typeof __VLS_98.emit>;
{
const __VLS_100 = __VLS_intrinsicElements["label"];
const __VLS_101 = __VLS_elementAsFunctionalComponent(__VLS_100);
const __VLS_102 = __VLS_101({ ...{}, class: ("inline-flex items-center cursor-pointer"), }, ...__VLS_functionalComponentArgsRest(__VLS_101));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_100, typeof __VLS_102> & Record<string, unknown>) => void)({ ...{}, class: ("inline-flex items-center cursor-pointer"), });
const __VLS_103 = __VLS_pickFunctionalComponentCtx(__VLS_100, __VLS_102)!;
let __VLS_104!: __VLS_NormalizeEmits<typeof __VLS_103.emit>;
{
const __VLS_105 = __VLS_intrinsicElements["input"];
const __VLS_106 = __VLS_elementAsFunctionalComponent(__VLS_105);
const __VLS_107 = __VLS_106({ ...{}, id: ("customCheckLogin"), type: ("checkbox"), class: ("form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_106));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_105, typeof __VLS_107> & Record<string, unknown>) => void)({ ...{}, id: ("customCheckLogin"), type: ("checkbox"), class: ("form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"), style: ({}), });
const __VLS_108 = __VLS_pickFunctionalComponentCtx(__VLS_105, __VLS_107)!;
let __VLS_109!: __VLS_NormalizeEmits<typeof __VLS_108.emit>;
}
{
const __VLS_110 = __VLS_intrinsicElements["span"];
const __VLS_111 = __VLS_elementAsFunctionalComponent(__VLS_110);
const __VLS_112 = __VLS_111({ ...{}, class: ("ml-2 text-sm font-semibold text-gray-700"), }, ...__VLS_functionalComponentArgsRest(__VLS_111));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_110, typeof __VLS_112> & Record<string, unknown>) => void)({ ...{}, class: ("ml-2 text-sm font-semibold text-gray-700"), });
const __VLS_113 = __VLS_pickFunctionalComponentCtx(__VLS_110, __VLS_112)!;
let __VLS_114!: __VLS_NormalizeEmits<typeof __VLS_113.emit>;
(__VLS_113.slots!).default;
}
(__VLS_103.slots!).default;
}
(__VLS_98.slots!).default;
}
{
const __VLS_115 = __VLS_intrinsicElements["div"];
const __VLS_116 = __VLS_elementAsFunctionalComponent(__VLS_115);
const __VLS_117 = __VLS_116({ ...{}, class: ("text-center mt-6"), }, ...__VLS_functionalComponentArgsRest(__VLS_116));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_115, typeof __VLS_117> & Record<string, unknown>) => void)({ ...{}, class: ("text-center mt-6"), });
const __VLS_118 = __VLS_pickFunctionalComponentCtx(__VLS_115, __VLS_117)!;
let __VLS_119!: __VLS_NormalizeEmits<typeof __VLS_118.emit>;
{
const __VLS_120 = __VLS_intrinsicElements["button"];
const __VLS_121 = __VLS_elementAsFunctionalComponent(__VLS_120);
const __VLS_122 = __VLS_121({ ...{ onClick: {} as any, }, class: ("bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"), type: ("button"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_121));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_120, typeof __VLS_122> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, class: ("bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"), type: ("button"), style: ({}), });
const __VLS_123 = __VLS_pickFunctionalComponentCtx(__VLS_120, __VLS_122)!;
let __VLS_124!: __VLS_NormalizeEmits<typeof __VLS_123.emit>;
let __VLS_125 = { 'click': __VLS_pickEvent(__VLS_124['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_121, typeof __VLS_122>).onClick) };
__VLS_125 = {
click: $event => {
__VLS_ctx.login();
// @ts-ignore
[login,];
}
};
(__VLS_123.slots!).default;
}
(__VLS_118.slots!).default;
}
(__VLS_63.slots!).default;
}
{
const __VLS_126 = __VLS_intrinsicElements["div"];
const __VLS_127 = __VLS_elementAsFunctionalComponent(__VLS_126);
const __VLS_128 = __VLS_127({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_127));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_126, typeof __VLS_128> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_129 = __VLS_pickFunctionalComponentCtx(__VLS_126, __VLS_128)!;
let __VLS_130!: __VLS_NormalizeEmits<typeof __VLS_129.emit>;
{
const __VLS_131 = __VLS_intrinsicElements["span"];
const __VLS_132 = __VLS_elementAsFunctionalComponent(__VLS_131);
const __VLS_133 = __VLS_132({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_132));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_131, typeof __VLS_133> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_134 = __VLS_pickFunctionalComponentCtx(__VLS_131, __VLS_133)!;
let __VLS_135!: __VLS_NormalizeEmits<typeof __VLS_134.emit>;
(__VLS_ctx.loggedIn ? 'yes' : 'no');
(__VLS_134.slots!).default;
}
(__VLS_129.slots!).default;
}
if (__VLS_ctx.loggedIn) {
{
const __VLS_136 = __VLS_intrinsicElements["div"];
const __VLS_137 = __VLS_elementAsFunctionalComponent(__VLS_136);
const __VLS_138 = __VLS_137({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_137));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_136, typeof __VLS_138> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_139 = __VLS_pickFunctionalComponentCtx(__VLS_136, __VLS_138)!;
let __VLS_140!: __VLS_NormalizeEmits<typeof __VLS_139.emit>;
{
const __VLS_141 = __VLS_intrinsicElements["span"];
const __VLS_142 = __VLS_elementAsFunctionalComponent(__VLS_141);
const __VLS_143 = __VLS_142({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_142));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_141, typeof __VLS_143> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_144 = __VLS_pickFunctionalComponentCtx(__VLS_141, __VLS_143)!;
let __VLS_145!: __VLS_NormalizeEmits<typeof __VLS_144.emit>;
(__VLS_ctx.user.name);
(__VLS_144.slots!).default;
}
(__VLS_139.slots!).default;
}
// @ts-ignore
[loggedIn, loggedIn, user,];
}
(__VLS_48.slots!).default;
}
(__VLS_38.slots!).default;
}
{
const __VLS_146 = __VLS_intrinsicElements["div"];
const __VLS_147 = __VLS_elementAsFunctionalComponent(__VLS_146);
const __VLS_148 = __VLS_147({ ...{}, class: ("flex flex-wrap mt-6"), }, ...__VLS_functionalComponentArgsRest(__VLS_147));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_146, typeof __VLS_148> & Record<string, unknown>) => void)({ ...{}, class: ("flex flex-wrap mt-6"), });
const __VLS_149 = __VLS_pickFunctionalComponentCtx(__VLS_146, __VLS_148)!;
let __VLS_150!: __VLS_NormalizeEmits<typeof __VLS_149.emit>;
{
const __VLS_151 = __VLS_intrinsicElements["div"];
const __VLS_152 = __VLS_elementAsFunctionalComponent(__VLS_151);
const __VLS_153 = __VLS_152({ ...{}, class: ("w-1/2"), }, ...__VLS_functionalComponentArgsRest(__VLS_152));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_151, typeof __VLS_153> & Record<string, unknown>) => void)({ ...{}, class: ("w-1/2"), });
const __VLS_154 = __VLS_pickFunctionalComponentCtx(__VLS_151, __VLS_153)!;
let __VLS_155!: __VLS_NormalizeEmits<typeof __VLS_154.emit>;
{
const __VLS_156 = __VLS_intrinsicElements["a"];
const __VLS_157 = __VLS_elementAsFunctionalComponent(__VLS_156);
const __VLS_158 = __VLS_157({ ...{}, href: ("#pablo"), class: ("text-gray-300"), }, ...__VLS_functionalComponentArgsRest(__VLS_157));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_156, typeof __VLS_158> & Record<string, unknown>) => void)({ ...{}, href: ("#pablo"), class: ("text-gray-300"), });
const __VLS_159 = __VLS_pickFunctionalComponentCtx(__VLS_156, __VLS_158)!;
let __VLS_160!: __VLS_NormalizeEmits<typeof __VLS_159.emit>;
{
const __VLS_161 = __VLS_intrinsicElements["small"];
const __VLS_162 = __VLS_elementAsFunctionalComponent(__VLS_161);
const __VLS_163 = __VLS_162({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_162));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_161, typeof __VLS_163> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_164 = __VLS_pickFunctionalComponentCtx(__VLS_161, __VLS_163)!;
let __VLS_165!: __VLS_NormalizeEmits<typeof __VLS_164.emit>;
(__VLS_164.slots!).default;
}
(__VLS_159.slots!).default;
}
(__VLS_154.slots!).default;
}
{
const __VLS_166 = __VLS_intrinsicElements["div"];
const __VLS_167 = __VLS_elementAsFunctionalComponent(__VLS_166);
const __VLS_168 = __VLS_167({ ...{}, class: ("w-1/2 text-right"), }, ...__VLS_functionalComponentArgsRest(__VLS_167));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_166, typeof __VLS_168> & Record<string, unknown>) => void)({ ...{}, class: ("w-1/2 text-right"), });
const __VLS_169 = __VLS_pickFunctionalComponentCtx(__VLS_166, __VLS_168)!;
let __VLS_170!: __VLS_NormalizeEmits<typeof __VLS_169.emit>;
{
const __VLS_171 = __VLS_intrinsicElements["a"];
const __VLS_172 = __VLS_elementAsFunctionalComponent(__VLS_171);
const __VLS_173 = __VLS_172({ ...{}, href: ("#pablo"), class: ("text-gray-300"), }, ...__VLS_functionalComponentArgsRest(__VLS_172));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_171, typeof __VLS_173> & Record<string, unknown>) => void)({ ...{}, href: ("#pablo"), class: ("text-gray-300"), });
const __VLS_174 = __VLS_pickFunctionalComponentCtx(__VLS_171, __VLS_173)!;
let __VLS_175!: __VLS_NormalizeEmits<typeof __VLS_174.emit>;
{
const __VLS_176 = __VLS_intrinsicElements["small"];
const __VLS_177 = __VLS_elementAsFunctionalComponent(__VLS_176);
const __VLS_178 = __VLS_177({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_177));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_176, typeof __VLS_178> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_179 = __VLS_pickFunctionalComponentCtx(__VLS_176, __VLS_178)!;
let __VLS_180!: __VLS_NormalizeEmits<typeof __VLS_179.emit>;
(__VLS_179.slots!).default;
}
(__VLS_174.slots!).default;
}
(__VLS_169.slots!).default;
}
(__VLS_149.slots!).default;
}
(__VLS_33.slots!).default;
}
(__VLS_28.slots!).default;
}
(__VLS_23.slots!).default;
}
(__VLS_13.slots!).default;
}
(__VLS_8.slots!).default;
}
(__VLS_3.slots!).default;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
setup() {
return {
user: user as typeof user,
login: login as typeof login,
};
},
});
export default (await import('vue')).defineComponent({
setup() {
return {};
},
});
