import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../laboratory/atr-002v.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const demo = JSON.parse(html.match(/id="responseJson"[^>]*>([\s\S]*?)<\/textarea>/)[1]);
const valid = {...demo, simulation:false, request_id:'atr-002v-002',
  trace_receipt_id:'inference:atr-002v-002', inference_classes:['D'], confidence:'moderate',
  response_text:'A reconstructed answer would distinguish work from judgments about status.',
  evidence_refs:['MA-CORPUS-0001:5.1'], provenance_refs:['runtime:manual-test']};

function harness({tts=true, throwSpeak=false, Recognition} = {}) {
  const elements = {};
  for (const [,id] of html.matchAll(/id="([^"]+)"/g)) elements[id] = {
    value:'', textContent:'', disabled:false, checked:false, listeners:{},
    addEventListener(name, fn) { this.listeners[name] = fn; }
  };
  elements.responseJson.value = JSON.stringify(demo);
  const spoken = [];
  let cancels = 0;
  const window = {};
  if (Recognition) window.SpeechRecognition = Recognition;
  if (tts) {
    window.SpeechSynthesisUtterance = function(text) { this.text = text; };
    window.speechSynthesis = {
      cancel() { cancels++; },
      speak(u) { if (throwSpeak) throw Error('device failure'); spoken.push(u); }
    };
  }
  const context = vm.createContext({window, document:{getElementById:id=>elements[id]}});
  vm.runInContext(script, context);
  return {elements, spoken, context, cancels:()=>cancels,
    validate:obj=>context.validateATRResponse(obj),
    load(obj) { elements.responseJson.value = JSON.stringify(obj); },
    click(id) { elements[id].listeners.click(); }
  };
}

test('default fixture is consistent and explicitly simulated; speech blocked', () => {
  const h = harness();
  assert.equal(h.validate(demo).kind,'simulated');
  h.elements.speechConsent.checked = true;
  h.click('speakButton');
  assert.equal(h.spoken.length,0);
  assert.match(h.elements.responseStatus.textContent,/SIMULATED/);
});

const negativeFixtures = [
  ['missing evidence', {evidence_refs:[]}],
  ['invalid confidence', {confidence:'unverified'}],
  ['inconsistent E confidence', {inference_classes:['E'], confidence:'high'}],
  ['mixed E confidence', {inference_classes:['D','E'], confidence:'moderate'}],
  ['unknown class', {inference_classes:['F']}],
  ['coerced class', {inference_classes:[['D']]}],
  ['duplicate classes', {inference_classes:['D','D']}],
  ['missing trace metadata', {trace_receipt_id:undefined}],
  ['missing request', {request_id:undefined}],
  ['missing provenance', {provenance_refs:[]}],
  ['unsupported historical claim', {response_text:'Marcus Aurelius explicitly endorsed modern AI replacing workers.', inference_classes:['A'], evidence_refs:[]}],
  ['lineage mismatch', {lineage_id:'OTHER'}],
  ['unbounded text', {response_text:'x'.repeat(12001)}],
  ['blank evidence', {evidence_refs:[' ']}],
  ['elevated authority', {authority_effect:'bounded_execution_return'}],
  ['missing temporal boundary', {temporal_boundary:undefined}],
  ['invalid status', {status:'authenticated'}],
  ['invalid simulation marker', {simulation:'false'}],
];
for (const [name, patch] of negativeFixtures) test(name + ' clears stale output and blocks speech', () => {
  const h = harness();
  h.load(valid); h.click('renderButton');
  h.load({...valid,...patch}); h.elements.speechConsent.checked = true;
  h.click('speakButton');
  assert.equal(h.spoken.length,0);
  assert.equal(h.elements.responseText.textContent,'No response rendered.');
  assert.equal(h.elements.traceMeta.textContent,'{}');
  assert.match(h.elements.responseStatus.textContent,/INVALID/);
  assert.ok(h.cancels() >= 2);
});

test('valid structure remains unverified and speech requires acknowledgement', () => {
  const h = harness(); h.load({...valid, authenticated:true});
  h.click('speakButton'); assert.equal(h.spoken.length,0);
  h.elements.speechConsent.checked = true; h.click('speakButton');
  assert.equal(h.spoken[0].text,valid.response_text);
  assert.match(h.elements.responseStatus.textContent,/STRUCTURE VALID.*unverified/);
  assert.doesNotMatch(h.elements.traceMeta.textContent,/authenticated/);
});
test('references cannot establish truth; supplied claims remain unverified', () => {
  const h = harness();
  h.load({...valid, response_text:'An invented historical claim.', evidence_refs:['fabricated:reference']});
  h.click('renderButton');
  assert.match(h.elements.responseStatus.textContent,/historical claims remain unverified/);
});
test('edits clear prior output, revoke acknowledgement, and cancel queued audio', () => {
  const h = harness(); h.load(valid); h.elements.speechConsent.checked = true;
  h.click('speakButton'); h.elements.responseJson.listeners.input();
  assert.equal(h.elements.speechConsent.checked,false);
  assert.equal(h.elements.responseText.textContent,'No response rendered.');
  assert.ok(h.cancels() >= 2);
});
for (const raw of ['{', 'null', '[]', '"text"', 'x'.repeat(50001)]) test('malformed or oversized input: '+raw.slice(0,8), () => {
  const h = harness(); h.elements.responseJson.value = raw; h.click('speakButton');
  assert.equal(h.spoken.length,0); assert.match(h.elements.responseStatus.textContent,/INVALID/);
});
test('E insufficient, mixed E, simulated and non-completed returns cannot speak', () => {
  for (const patch of [
    {inference_classes:['E'],confidence:'insufficient',evidence_refs:[]},
    {inference_classes:['D','E'],confidence:'insufficient'},
    {confidence:'insufficient'}, {simulation:true}, {status:'failed'}, {status:'refused'}, {status:'degraded'}
  ]) {
    const h = harness(); h.load({...valid,...patch}); h.elements.speechConsent.checked = true;
    h.click('speakButton'); assert.equal(h.spoken.length,0);
    assert.notEqual(h.elements.responseText.textContent,'No response rendered.');
  }
});
test('missing speech APIs preserve text input and response', () => {
  const h = harness({tts:false}); h.elements.transcript.value = 'Typed question';
  h.load(valid); h.elements.speechConsent.checked = true; h.click('speakButton');
  assert.equal(h.elements.transcript.value,'Typed question');
  assert.equal(h.elements.responseText.textContent,valid.response_text);
  assert.equal(h.elements.micButton.disabled,true);
  h.click('clearButton'); assert.equal(h.elements.transcript.value,'');
});
test('TTS synchronous and asynchronous failure preserve text', () => {
  for (const throwSpeak of [true,false]) {
    const h = harness({throwSpeak}); h.load(valid); h.elements.speechConsent.checked = true;
    h.click('speakButton'); if (!throwSpeak) h.spoken[0].onerror();
    assert.equal(h.elements.responseText.textContent,valid.response_text);
    assert.match(h.elements.parseState.textContent,/Speech failed/);
  }
});
test('recognition constructor and start failures preserve typed input', () => {
  for (const Recognition of [
    class {constructor(){throw Error('unavailable');}},
    class {start(){throw Error('denied');}}
  ]) {
    const h = harness({Recognition}); h.elements.transcript.value = 'Typed question';
    if (!h.elements.micButton.disabled) h.click('micButton');
    assert.equal(h.elements.transcript.value,'Typed question');
  }
});
test('recognition result uses same transcript and permission errors do not erase it', () => {
  let instance;
  const h = harness({Recognition:class {constructor(){instance=this;} start(){this.onstart();}}});
  h.elements.transcript.value='Typed';
  h.click('micButton');
  const result = [{transcript:'spoken'}]; result.isFinal=true;
  instance.onresult({resultIndex:0,results:[result]});
  instance.onerror({error:'not-allowed'}); instance.onend();
  assert.equal(h.elements.transcript.value,'Typed spoken');
});
