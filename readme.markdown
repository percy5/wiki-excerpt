# jQuery wiki-excerpt extension

This jQuery extension fetches the excerpt (first paragraph) for a word from it's Wikipedia page. Have words on a HTML surrouned by a 'anchor' tag with some class. And with that class initialise wiki-excerpt, thats it.

For more on how to use, see `excerpt.html` file from the repo.

## USAGE

Include:

        Include these files `wiki-excerpt.css` `wiki-excerpt.js`

HTML:

     <a href="#" class="define">Shivaji</a> and so on ...


init JS:

    <script type="text/javascript">
        $(document).ready(function () {
                            var excerpt = $(".define").excerpt();
                            excerpt.addDefinition("_word_" , "_defination_");
                          });
    </script>


## TODOS

- TEST on different versions of IE.
- Fix initialise API.
- Show excerpt like a ToolTip

