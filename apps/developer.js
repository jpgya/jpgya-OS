import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "デベロッパー",
  icon: "👨‍💻",
  desc: "JS/ブロックで自作アプリを追加・実行"
};

// container を受け取る形に変更
export async function main(container) {
  container.innerHTML = `
    <div style="margin-bottom:8px;">
      <input id="dev-app-name" placeholder="アプリ名" style="width:32%">
      <input id="dev-app-icon" placeholder="アイコン絵文字" maxlength="2" style="width:18%">
      <button id="dev-load-file">JSファイル読込</button>
      <input id="dev-file" type="file" accept=".js" style="display:none;">
      <select id="dev-mode">
        <option value="js">JSコード</option>
        <option value="block">ブロック</option>
      </select>
    </div>
    <div id="dev-js-area">
      <textarea id="dev-code" style="width:100%;height:120px;" placeholder="// ここにJSコードを書くか、ファイルを読込"></textarea>
    </div>
    <div id="dev-blockly-area" style="width:100%;height:220px;display:none;background:#fff;border-radius:8px;"></div>
    <div style="margin:8px 0;">
      <button id="dev-run">実行</button>
      <button id="dev-save">保存</button>
      <button id="dev-block2js" style="display:none;">ブロック→JSに変換</button>
    </div>
    <div id="dev-msg" style="color:#0af;"></div>
    <div style="margin-top:10px;font-size:13px;color:#aaa;">
      main関数とmetaオブジェクトを必ず定義してください。<br>
      例:<br>
      <code>
      export const meta = { name: "MyApp", icon: "⭐", desc: "説明" };<br>
      export function main(container) { alert("Hello!"); }
      </code>
    </div>
  `;

  makeWindowDraggable(container);

  let workspace = null;

  // Blockly初期化
  function initBlockly() {
    if (workspace) return;
    workspace = Blockly.inject(container.querySelector('#dev-blockly-area'), {
      toolbox: `
        <xml>
          <category name="ロジック" colour="#5C81A6">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_boolean"></block>
            <block type="logic_null"></block>
            <block type="logic_ternary"></block>
          </category>
          <category name="ループ" colour="#5CA65C">
            <block type="controls_repeat_ext"></block>
            <block type="controls_whileUntil"></block>
            <block type="controls_for"></block>
            <block type="controls_forEach"></block>
            <block type="controls_flow_statements"></block>
          </category>
          <category name="数値" colour="#5C68A6">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
            <block type="math_trig"></block>
            <block type="math_constant"></block>
            <block type="math_number_property"></block>
            <block type="math_round"></block>
            <block type="math_on_list"></block>
            <block type="math_modulo"></block>
            <block type="math_constrain"></block>
            <block type="math_random_int"></block>
            <block type="math_random_float"></block>
          </category>
          <category name="テキスト" colour="#5CA68D">
            <block type="text"></block>
            <block type="text_join"></block>
            <block type="text_append"></block>
            <block type="text_length"></block>
            <block type="text_isEmpty"></block>
            <block type="text_indexOf"></block>
            <block type="text_charAt"></block>
            <block type="text_getSubstring"></block>
            <block type="text_changeCase"></block>
            <block type="text_trim"></block>
            <block type="text_print"></block>
            <block type="text_prompt_ext"></block>
          </category>
          <category name="変数" colour="#A65C81" custom="VARIABLE"></category>
          <category name="関数" colour="#9A5CA6" custom="PROCEDURE"></category>
        </xml>
      `
    });
  }

  // モード切替
  container.querySelector('#dev-mode').onchange = e => {
    if (e.target.value === "block") {
      container.querySelector('#dev-js-area').style.display = "none";
      container.querySelector('#dev-blockly-area').style.display = "";
      container.querySelector('#dev-block2js').style.display = "";
      initBlockly();
    } else {
      container.querySelector('#dev-js-area').style.display = "";
      container.querySelector('#dev-blockly-area').style.display = "none";
      container.querySelector('#dev-block2js').style.display = "none";
    }
  };

  // ファイル読込
  container.querySelector('#dev-load-file').onclick = () => {
    container.querySelector('#dev-file').click();
  };
  container.querySelector('#dev-file').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      container.querySelector('#dev-code').value = ev.target.result;
      container.querySelector('#dev-app-name').value = file.name.replace(/\.js$/,"");
      container.querySelector('#dev-mode').value = "js";
      container.querySelector('#dev-js-area').style.display = "";
      container.querySelector('#dev-blockly-area').style.display = "none";
      container.querySelector('#dev-block2js').style.display = "none";
    };
    reader.readAsText(file);
  };

  // ブロック→JS変換
  container.querySelector('#dev-block2js').onclick = () => {
    if (!workspace) return;
    let js = Blockly.JavaScript.workspaceToCode(workspace);
    js = `export const meta = { name: "${container.querySelector('#dev-app-name').value.trim()}", icon: "${container.querySelector('#dev-app-icon').value.trim()}", desc: "ブロックで作成" };\nexport function main(container) {\n${js}\n}`;
    container.querySelector('#dev-code').value = js;
    container.querySelector('#dev-mode').value = "js";
    container.querySelector('#dev-js-area').style.display = "";
    container.querySelector('#dev-blockly-area').style.display = "none";
    container.querySelector('#dev-block2js').style.display = "none";
  };

  // 実行
  container.querySelector('#dev-run').onclick = async () => {
    const name = container.querySelector('#dev-app-name').value.trim();
    const icon = container.querySelector('#dev-app-icon').value.trim();
    let code = container.querySelector('#dev-code').value;
    if (container.querySelector('#dev-mode').value === "block" && workspace) {
      code = `export const meta = { name: "${name}", icon: "${icon}", desc: "ブロックで作成" };\nexport function main(container) {\n${Blockly.JavaScript.workspaceToCode(workspace)}\n}`;
    }
    if (!name || !icon) {
      container.querySelector('#dev-msg').textContent = "アプリ名とアイコン絵文字を入力してください";
      return;
    }
    if (!code) {
      container.querySelector('#dev-msg').textContent = "コードを入力してください";
      return;
    }
    try {
      const blob = new Blob([code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const mod = await import(url);
      if (mod.main) mod.main(container); // container に描画
      URL.revokeObjectURL(url);
      container.querySelector('#dev-msg').textContent = "実行しました";
    } catch (e) {
      container.querySelector('#dev-msg').textContent = "エラー: " + e.message;
    }
  };

  // 保存
  container.querySelector('#dev-save').onclick = () => {
    const name = container.querySelector('#dev-app-name').value.trim();
    const icon = container.querySelector('#dev-app-icon').value.trim();
    let code = container.querySelector('#dev-code').value;
    if (container.querySelector('#dev-mode').value === "block" && workspace) {
      code = `export const meta = { name: "${name}", icon: "${icon}", desc: "ブロックで作成" };\nexport function main(container) {\n${Blockly.JavaScript.workspaceToCode(workspace)}\n}`;
    }
    if (!name || !icon) {
      container.querySelector('#dev-msg').textContent = "アプリ名とアイコン絵文字を入力してください";
      return;
    }
    if (!code) {
      container.querySelector('#dev-msg').textContent = "コードを入力してください";
      return;
    }
    localStorage.setItem("devapp:" + name, JSON.stringify({ icon, code }));
    container.querySelector('#dev-msg').textContent = "保存しました";
  };
}
