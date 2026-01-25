Add runtime validation to DataGolf queries.

For each query touched:

1. Create/extend Zod schema for the response.
2. Parse + narrow the response before mapping.
3. Return a typed, stable domain shape.
4. Add consistent error mapping.

Finish with:

- list of endpoints now validated
- any endpoints still unvalidated
