import re

with open('src/presentation/components/widgets/niches/capilar/AIAssistantWidgetCapilar.tsx', 'r') as f:
    content = f.read()

# Replace the shell
content = re.sub(r'export function AIAssistantWidgetCapilar\(\{\s*color.*?\)\s*\{', 
'''import { WidgetShell } from "../../base/WidgetShell";
import { BookingCheckoutStep, SuccessStep } from "../../base/shared-steps";

export function AIAssistantWidgetCapilar({ color, isOpen, setIsOpen }: { color: string, isOpen: boolean, setIsOpen: (b: boolean) => void }) {
''', content, count=1)

content = re.sub(r'const TOTAL_STEPS = 11;', 'const TOTAL_STEPS = 10;', content)
content = re.sub(r'if \(!isOpen\) return null;', '', content)
content = re.sub(r'const contrastText = getContrastColor\(color\);', 'const contrastText = getContrastColor(color);\n  const sharedProps = { color, contrastText, nextStep: () => setStep(s => s+1), totalSteps: TOTAL_STEPS };\n', content)

# Replace the return block wrapper
wrapper_match = re.search(r'return \(\s*<div className={`fixed inset-0.*?<AnimatePresence mode="wait">', content, re.DOTALL)
if wrapper_match:
    content = content.replace(wrapper_match.group(0), 'return (\n    <WidgetShell isOpen={isOpen} step={step} totalSteps={TOTAL_STEPS} color={color} onPrev={prevStep} hideBackButtonOnSteps={[10]}>')

header_match = re.search(r'\{/\* Top Header: Progress Bar.*?</header>\s*<main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 sm:pb-8">\s*<AnimatePresence mode="wait">', content, re.DOTALL)
if header_match:
    content = content.replace(header_match.group(0), '')

# Replace closing tags
footer_match = re.search(r'</AnimatePresence>\s*</main>\s*</motion\.div>\s*</AnimatePresence>\s*</div>\s*\);\s*\}', content, re.DOTALL)
if footer_match:
    content = content.replace(footer_match.group(0), '</WidgetShell>\n  );\n}')

# Replace Steps 9, 10, 11
steps_match = re.search(r'\{/\* STEP 9: CALENDAR \*/\}.*?(?=</AnimatePresence>\s*</WidgetShell>)', content, re.DOTALL)
if steps_match:
    content = content.replace(steps_match.group(0), '{/* STEP 9: CHECKOUT */}\n       {step === 9 && <BookingCheckoutStep {...sharedProps} />}\n       {/* STEP 10: SUCCESS */}\n       {step === 10 && <SuccessStep doctorName={doctor} onClose={() => setIsOpen(false)} />}\n')

with open('src/presentation/components/widgets/niches/capilar/AIAssistantWidgetCapilar.tsx', 'w') as f:
    f.write(content)

