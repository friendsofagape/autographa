module.exports = {
    schemaIds: {
        "metadata": "https://burrito.bible/schema/metadata.schema.json",
        "referenceFormat": "https://burrito.bible/schema/reference_format.schema.json"
    },
    schemas: [
        require("./agencies.schema.json"),
        require("./agency.schema.json"),
        require("./common.schema.json"),
        require("./confidential.schema.json"),
        require("./copyright.schema.json"),
        require("./copyright_constraints.schema.json"),
        require("./derived_meta.schema.json"),
        require("./derived_metadata.schema.json"),
        require("./gloss/text_stories.schema.json"),
        require("./identification.schema.json"),
        require("./id_authorities.schema.json"),
        require("./ingredient.schema.json"),
        require("./ingredients.schema.json"),
        require("./language.schema.json"),
        require("./languages.schema.json"),
        require("./meta_comments.schema.json"),
        require("./meta_date_created.schema.json"),
        require("./meta_default_language.schema.json"),
        require("./meta_version.schema.json"),
        require("./metadata.schema.json"),
        require("./name.schema.json"),
        require("./names.schema.json"),
        require("./normalization.schema.json"),
        require("./numbering_system.schema.json"),
        require("./parascriptural/word_alignment.schema.json"),
        require("./progress.schema.json"),
        require("./promotion.schema.json"),
        require("./recipe.schema.json"),
        require("./recipe_section.schema.json"),
        require("./recipe_element.schema.json"),
        require("./reference_format.schema.json"),
        require("./relationships.schema.json"),
        require("./relationship.schema.json"),
        require("./scripture/audio_translation.schema.json"),
        require("./scripture/embossed_braille_scripture.schema.json"),
        require("./scripture/sign_language_video_translation.schema.json"),
        require("./scripture/text_translation.schema.json"),
        require("./scripture/typeset_scripture.schema.json"),
        require("./role.schema.json"),
        require("./scope.schema.json"),
        require("./software_and_user_info.schema.json"),
        require("./source_meta.schema.json"),
        require("./source_metadata.schema.json"),
        require("./target_areas.schema.json"),
        require("./target_area.schema.json"),
        require("./template_meta.schema.json"),
        require("./template_metadata.schema.json"),
        require("./type.schema.json"),
        require("./unm49.schema.json"),
        require("./x_flavor.schema.json")
    ]
};
