import { Extension, textInputRule } from "@tiptap/core";

const Glyphs = Extension.create({
  name: "Glyphs",

  addInputRules() {
    return [
      // Emoji Shortcodes
      textInputRule({ find: /:heart:$/, replace: "❤️ " }),
      textInputRule({ find: /:heart_hands:$/, replace: "🫶 " }),
      textInputRule({ find: /:sparkles:$/, replace: "✨ " }),
      textInputRule({ find: /:party:$/, replace: "🎉 " }),
      textInputRule({ find: /:fire:$/, replace: "🔥 " }),
      textInputRule({ find: /:100:$/, replace: "💯 " }),
      textInputRule({ find: /:poop:$/, replace: "💩 " }),
      textInputRule({ find: /:eyes:$/, replace: "👀 " }),
      textInputRule({ find: /:ghost:$/, replace: "👻 " }),
      textInputRule({ find: /:graduation_cap:$/, replace: "🎓 " }),
      textInputRule({ find: /:thumbsup:$/, replace: "👍 " }),
      textInputRule({ find: /:thumbsdown:$/, replace: "👎 " }),
      textInputRule({ find: /:rocket:$/, replace: "🚀 " }),
      textInputRule({ find: /:salute:$/, replace: "👋 " }),
      textInputRule({ find: /:grinning_face:$/, replace: "😀 " }),
      textInputRule({ find: /:sweat_smile:$/, replace: "😅 " }),
      textInputRule({ find: /:droplet:$/, replace: "💧 " }),
      textInputRule({ find: /:starstruck:$/, replace: "🤩 " }),
      textInputRule({ find: /:sob:$/, replace: "😭 " }),
      textInputRule({ find: /:skull:$/, replace: "💀 " }),
      textInputRule({ find: /:smile:$/, replace: "😄 " }),
      textInputRule({ find: /:rofl:$/, replace: "🤣 " }),
      textInputRule({ find: /:wink:$/, replace: "😉 " }),
      textInputRule({ find: /:candle:$/, replace: "🕯️ " }),
      textInputRule({ find: /:diya_lamp:$/, replace: "🪔 " }),
      textInputRule({ find: /:rainbow:$/, replace: "🌈 " }),
      textInputRule({ find: /:om:$/, replace: "🕉️ " }),
      textInputRule({ find: /:bulb:$/, replace: "💡 " }),
      textInputRule({ find: /:dizzy:$/, replace: "💫 " }),
      textInputRule({ find: /:bomb:$/, replace: "💣 " }),
      textInputRule({ find: /:firecracker:$/, replace: "🧨 " }),
      textInputRule({ find: /:fireworks:$/, replace: "🎆 " }),
      textInputRule({ find: /:alien:$/, replace: "👽 " }),
      textInputRule({ find: /:robot:$/, replace: "🤖 " }),
      textInputRule({ find: /:crystal_ball:$/, replace: "🔮 " }),
      textInputRule({ find: /:chocolate_bar:$/, replace: "🍫 " }),
      textInputRule({ find: /:unicorn:$/, replace: "🦄 " }),
      textInputRule({ find: /:clown_face:$/, replace: "🤡 " }),
    ];
  },
});

export default Glyphs;
