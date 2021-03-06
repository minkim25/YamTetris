﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Board : MonoBehaviour {

	public Transform m_emptySprite;
	public int m_height = 30;
	public int m_width = 10;
	public int m_header = 8;
	public int m_completedRows = 0;
	Transform[,] m_grid; //store inactive shapes

	// Use this for initialization
	void Awake() {
		m_grid = new Transform[m_width, m_height];
	}

	void Start () {
		DrawEmptyCells();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	bool IsWithinBoard(int x, int y) {
		return (x >= 0 && x < m_width && y >= 0);
	}

	bool IsOccupied(int x, int y, Shape shape) {
		return (m_grid [x, y] != null && m_grid [x, y].parent != shape.transform);
	}

	public bool IsValidPosition(Shape shape) {
		foreach (Transform child in shape.transform) {
			Vector2 pos = Vectorf.Round (child.position);

			if (!IsWithinBoard ((int)pos.x, (int)pos.y)) {
				return false;
			}

			if (IsOccupied ((int)pos.x, (int)pos.y, shape)) {
				return false;
			}
		}
		return true;
	}

	public bool IsValidPosBoard(Shape shape) {
		foreach (Transform child in shape.transform) {
			Vector2 pos = Vectorf.Round (child.position);

			if (!IsWithinBoard ((int)pos.x, (int)pos.y)) {
				return false;
			}
		}
		return true;
	}

	public bool IsValidPosOccupied(Shape shape) {
		foreach (Transform child in shape.transform) {
			Vector2 pos = Vectorf.Round (child.position);

			if (IsOccupied ((int)pos.x, (int)pos.y, shape)) {
				return false;
			}
		}
		return true;
	}

	public int CalcOffsetBoard(Shape shape) {
		int w_offset = 0;

		foreach (Transform child in shape.transform) {
			Vector2 pos = Vectorf.Round (child.position);

			if ((int)pos.x == -1) {
				w_offset -= 1;
			} else if ((int)pos.x == -2) {
				w_offset -= 10;
			} else if ((int)pos.x == m_width) {
				w_offset += 1;
			} else if ((int)pos.x == m_width+1) {
				w_offset += 10;
			}
		}
		return w_offset;
	}

	void DrawEmptyCells(){
		if (m_emptySprite != null) {
			for (int y = 0; y < m_height - m_header; y++) {
				for (int x = 0; x < m_width; x++) {
					Transform clone;
					clone = Instantiate(m_emptySprite, new Vector3 (x, y, 0), Quaternion.identity) as Transform;
					clone.name = "Board Space ( x = " + x.ToString () + " , y = " + y.ToString () + " )";
					clone.transform.parent = transform;
				}
			}
		}
		else {
			Debug.Log ("WARNING! Please assign the emptySprite object!");
		}
	}

	public void StoreShapeInGrid(Shape shape) {
		if (shape == null) {
			return;
		}

		foreach (Transform child in shape.transform) {
			Vector2 pos = Vectorf.Round (child.position);
			m_grid [(int)pos.x, (int)pos.y] = child;
		}
	}

	bool IsComplete(int y) {
		for (int x = 0; x < m_width; ++x) {
			if (m_grid [x, y] == null) {
				return false;
			}
		}
		return true;
	}

	void ClearRow(int y) {
		for (int x = 0; x < m_width; ++x) {
			if (m_grid [x, y] != null) {
				Destroy (m_grid [x, y].gameObject);
			}
			m_grid [x, y] = null;
		}
	}

	void ShiftOneRowDown(int y) {
		for (int x = 0; x < m_width; ++x) {
			if (m_grid [x, y] != null) {
				m_grid [x, y - 1] = m_grid [x, y];
				m_grid [x, y] = null;
				m_grid [x, y - 1].position += new Vector3 (0, -1, 0);
			}
		}
	}

	void ShiftRowsDown(int startY) {
		for (int i = startY; i < m_height; ++i) {
			ShiftOneRowDown (i);
		}
	}

	public void ClearAllRows() {
		m_completedRows = 0;

		for (int y = 0; y < m_height; ++y) {
			if (IsComplete (y)) {
				m_completedRows++;
				ClearRow (y);
				ShiftRowsDown (y + 1);
				y--;
			}
		}
	}

	public bool IsOverLimit(Shape shape) {
		foreach (Transform child in shape.transform) {
			if (child.transform.position.y >= (m_height - m_header - 1)) {
				return true;
			}
		}

		return false;
	}


	public int[,] GetGridArray() {
		int [,] g_array = new int[m_height - m_header,m_width];
		string arrayString = "";

		for (int y = 0; y < m_height - m_header; y++) {
			for (int x = 0; x < m_width; x++) {
				if (m_grid [x, y] == null) {
					g_array [m_height - m_header - 1 - y,x] = 0;
				} else {
					g_array [m_height - m_header - 1 - y,x] = 1;
				}
			}
		} 

		for (int i = 0; i < m_height - m_header; i++)
		{
			for (int j = 0; j < m_width; j++)
			{
				arrayString += string.Format("{0} ", g_array[i, j]);
			}
			arrayString += System.Environment.NewLine;
		}
		Debug.Log(arrayString);

		return g_array;
	}

	public int GetColumnBlockHeight(int col) {
		int h = 0;

		for (int y = 1; y <= m_height - m_header; y++) {
			if (m_grid [col, y-1] != null && y > h) {
				h = y;
			}
		}
		//Debug.Log (h);

		return h;
	}

	public int GetHoleCount() {
		int height = 0;
		int hole = 0;

		for (int x = 0; x < m_width; x++) {
			height = GetColumnBlockHeight (x);

			for (int y = 0; y < height; y++) {
				if (m_grid [x, y] == null) {
					hole++;
				}
			}
		}
		//Debug.Log (hole);

		return hole;
	}

	public int GetTotalHeight() {
		int total = 0;

		for (int x = 0; x < m_width; x++) {
			total += GetColumnBlockHeight (x);
		}
		//Debug.Log (total);

		return total;
	}

	public int GetBumpiness() {
		int b = 0;
		int temp1 = 0;
		int temp2 = 0;

		for (int x = 0; x < m_width-1; x++) {
			temp1 = GetColumnBlockHeight (x);
			temp2 = GetColumnBlockHeight (x+1);

			if (temp1 > temp2) {
				b += temp1 - temp2;
			} else {
				b += temp2 - temp1;
			}
		}
		//Debug.Log (b);

		return b;
	}




}