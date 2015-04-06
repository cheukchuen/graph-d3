# Graph of the Gods with D3.js
<a href="http://d3js.org/">D3.js</a> visualization of <i>The Graph of the Gods</i>, a <a href="http://s3.thinkaurelius.com/docs/titan/0.5.4/getting-started.html">toy graph<a> taken as an example from the <a href="http://thinkaurelius.github.io/titan/">Titan</a> graph database through <a href="https://github.com/tinkerpop/gremlin/wiki">Gremlin</a>.

To extract the graph in JSON format with Gremlin:
```
gremlin> g = TitanFactory.open('conf/titan-berkeleydb-es.properties')
gremlin> GraphOfTheGodsFactory.load(g)
gremlin> g.V.sideEffect{it.setProperty('type', (String) it.getVertexLabel())}.iterate()
gremlin> g.saveGraphSON("graph-of-the-gods.json")
```
